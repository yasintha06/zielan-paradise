"""
Zeilan Paradise — Enquiries (contact form + journey planner)
Public:  POST /api/enquiries  (alias /api/inquiries)
Admin:   GET /api/admin/inquiries · PATCH/DELETE /api/admin/inquiries/<id>

Every enquiry is stored in one shape:
  { id, kind: 'planner'|'contact', firstName, lastName, email, phone,
    interest, travelDates, guests, message, trip: {...}, status, notes, createdAt }
Older records in other shapes are converted when read.
"""
import html
import os
import re
import smtplib
import threading
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from api_utils import ApiError, id_query, new_id, now_iso, public, require_db
from db import get_db

enquiries_bp = Blueprint('enquiries', __name__)

EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
STATUSES = ['New', 'Contacted', 'Proposal sent', 'Booked', 'Closed']


def _s(value, limit=300):
    return str(value if value is not None else '').strip()[:limit]


def _list(value):
    return [_s(v, 80) for v in value][:20] if isinstance(value, list) else []


def _int(value, default=0):
    try:
        return max(0, min(int(value), 99))
    except (TypeError, ValueError):
        return default


def normalise(raw):
    """Turn a submitted (or older stored) enquiry into the single stored shape."""
    name = raw.get('clientName') if isinstance(raw.get('clientName'), dict) else {}
    contact = raw.get('contact') if isinstance(raw.get('contact'), dict) else {}
    trip_in = raw.get('tripDetails') if isinstance(raw.get('tripDetails'), dict) else (raw.get('trip') or {})
    prefs = raw.get('preferences') if isinstance(raw.get('preferences'), dict) else {}
    people = trip_in.get('travelers') if isinstance(trip_in.get('travelers'), dict) else {}
    is_planner = raw.get('kind') == 'planner' or bool(raw.get('tripDetails')) or bool(name)

    lead = {
        'kind': 'planner' if is_planner else 'contact',
        'firstName': _s(name.get('firstName', raw.get('firstName')), 80),
        'lastName': _s(name.get('lastName', raw.get('lastName')), 80),
        'email': _s(contact.get('email', raw.get('email')), 200),
        'phone': _s(contact.get('phone', raw.get('phone')), 40),
        'interest': _s(raw.get('interest'), 120),
        'travelDates': _s(raw.get('travelDates'), 120),
        'guests': _s(raw.get('guests'), 120),
        'message': _s(raw.get('additionalNotes', raw.get('message')), 4000),
    }
    if is_planner:
        lead['trip'] = {
            'month': _s(trip_in.get('estimatedMonth', trip_in.get('month')), 60),
            'days': _int(trip_in.get('durationDays', trip_in.get('days'))),
            'adults': _int(people.get('adults', trip_in.get('adults')), 2),
            'children': _int(people.get('children', trip_in.get('children'))),
            'stay': _s(trip_in.get('accommodationStyle', trip_in.get('stay')), 60),
            'interests': _list(prefs.get('interests', trip_in.get('interests'))),
            'regions': _list(prefs.get('regions', trip_in.get('regions'))),
            'pace': _s(prefs.get('pace', trip_in.get('pace')), 40),
            'stage': _s(raw.get('planningStage', trip_in.get('stage')), 80),
        }
    return lead


def for_admin(doc):
    doc = public(doc)
    lead = normalise(doc)
    status = doc.get('status') or 'New'
    lead.update(
        id=doc['id'],
        status='New' if status == 'New Lead' else status,
        notes=doc.get('notes', ''),
        createdAt=doc.get('createdAt') or doc.get('submittedAt') or '',
        updatedAt=doc.get('updatedAt', ''),
    )
    return lead


# ── Email notification ───────────────────────────────────────
def _env(*names, default=None):
    """First non-empty environment variable among the given names (supports SMTP_* and MAIL_* naming)."""
    for name in names:
        value = os.environ.get(name)
        if value:
            return value
    return default


def email_configured():
    return bool(_env("SMTP_USER", "MAIL_USERNAME") and _env("SMTP_PASS", "MAIL_PASSWORD")
                and _env("ADMIN_NOTIFICATION_EMAIL", "ADMIN_EMAIL"))


def _lead_email_html(lead):
    e = lambda v: html.escape(str(v))
    trip = lead.get('trip') or {}
    rows = [
        ("Form", "Journey planner" if lead['kind'] == 'planner' else "Contact form"),
        ("Name", f"{lead['firstName']} {lead['lastName']}".strip()),
        ("Email", lead['email']),
        ("Phone / WhatsApp", lead['phone']),
        ("Interested in", lead['interest']),
        ("Travel dates", trip.get('month') or lead['travelDates']),
        ("Length", f"{trip['days']} days" if trip.get('days') else ''),
        ("Travellers", f"{trip.get('adults', 0)} adults, {trip.get('children', 0)} children" if trip else lead['guests']),
        ("Stays", trip.get('stay')),
        ("Interests", ", ".join(trip.get('interests', []))),
        ("Regions", ", ".join(trip.get('regions', []))),
        ("Pace", trip.get('pace')),
        ("Planning stage", trip.get('stage')),
        ("Message", lead['message']),
    ]
    body = "".join(
        f'<tr><td style="padding:6px 12px;color:#666;vertical-align:top">{e(k)}</td>'
        f'<td style="padding:6px 12px;white-space:pre-wrap">{e(v)}</td></tr>'
        for k, v in rows if v
    )
    return (f'<html><body style="font-family:Arial,sans-serif;color:#222">'
            f'<h2 style="color:#005b52">New enquiry</h2><table>{body}</table>'
            f'<p style="color:#888;font-size:12px">Reply to this email to answer the guest directly.</p></body></html>')


def send_lead_email_async(lead):
    def send_email():
        sender = _env("SMTP_USER", "MAIL_USERNAME")
        password = _env("SMTP_PASS", "MAIL_PASSWORD")
        recipient = _env("ADMIN_NOTIFICATION_EMAIL", "ADMIN_EMAIL")
        if not (sender and password and recipient):
            print("[INFO] Email not configured (SMTP_USER/SMTP_PASS/ADMIN_NOTIFICATION_EMAIL). Skipping.")
            return

        msg = MIMEMultipart("alternative")
        label = "Journey planner" if lead['kind'] == 'planner' else "Enquiry"
        msg["Subject"] = f"{label}: {lead['firstName']} {lead['lastName']}".strip()
        msg["From"] = _env("EMAIL_FROM", default=sender)
        msg["To"] = recipient
        if lead.get('email'):
            msg["Reply-To"] = lead['email']
        msg.attach(MIMEText(_lead_email_html(lead), "html"))

        try:
            host = _env("SMTP_HOST", "MAIL_SERVER", default="mail.privateemail.com")
            port = int(_env("SMTP_PORT", "MAIL_PORT", default="587"))
            with smtplib.SMTP(host, port, timeout=20) as server:
                server.starttls()
                server.login(sender, password)
                server.send_message(msg)
            print("[INFO] Lead notification email sent.")
        except Exception as e:
            print(f"[ERROR] Failed to send email: {e}")

    # Send in the background so the visitor isn't kept waiting.
    threading.Thread(target=send_email, daemon=True).start()


# ── Public ───────────────────────────────────────────────────
@enquiries_bp.route('/api/inquiries', methods=['POST'])
@enquiries_bp.route('/api/enquiries', methods=['POST'])
def submit_inquiry():
    raw = request.get_json(silent=True)
    if not isinstance(raw, dict):
        raise ApiError("Please fill in the form.")

    # Honeypot: real visitors never see or fill the hidden "website" field.
    if raw.get('website'):
        return jsonify({"message": "Thank you."}), 201

    lead = normalise(raw)
    if not lead['firstName'] or not lead['email']:
        raise ApiError("Please add your first name and email address.")
    if not EMAIL_RE.match(lead['email']):
        raise ApiError("Please enter a valid email address.")

    lead.update(id=new_id('enq'), status='New', notes='', createdAt=now_iso())

    db = get_db()
    if db is not None:
        try:
            db.inquiries.insert_one(dict(lead))
        except Exception as e:
            print(f"[ERROR] Failed to save enquiry to MongoDB: {e}")
            if not email_configured():
                raise ApiError("We couldn't receive your enquiry right now. Please contact us directly.", 503)
        send_lead_email_async(lead)
    elif email_configured():
        # No database: the email notification is the only record.
        send_lead_email_async(lead)
    else:
        print("[ERROR] Enquiry received but neither MongoDB nor email is available; it cannot be stored.")
        raise ApiError("We couldn't receive your enquiry right now. Please contact us directly.", 503)

    return jsonify({"message": "Thank you. We'll be in touch soon.", "id": lead['id']}), 201


# ── Admin ────────────────────────────────────────────────────
@enquiries_bp.route('/api/admin/enquiries', methods=['GET'])
@enquiries_bp.route('/api/admin/inquiries', methods=['GET'])
@jwt_required()
def admin_list_inquiries():
    db = require_db()
    leads = [for_admin(d) for d in db.inquiries.find()]
    leads.sort(key=lambda l: l['createdAt'] or '', reverse=True)
    return jsonify(leads), 200


@enquiries_bp.route('/api/admin/inquiries/<lead_id>', methods=['PATCH'])
@jwt_required()
def admin_update_inquiry(lead_id):
    db = require_db()
    data = request.get_json(silent=True) or {}
    update = {}
    if 'status' in data:
        if data['status'] not in STATUSES:
            raise ApiError(f"Status must be one of: {', '.join(STATUSES)}.")
        update['status'] = data['status']
    if 'notes' in data:
        update['notes'] = _s(data['notes'], 5000)
    if not update:
        raise ApiError("Nothing to update.")
    update['updatedAt'] = now_iso()
    if db.inquiries.update_one(id_query(lead_id), {"$set": update}).matched_count == 0:
        raise ApiError("Enquiry not found.", 404)
    return jsonify(for_admin(db.inquiries.find_one(id_query(lead_id)))), 200


@enquiries_bp.route('/api/admin/inquiries/<lead_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_inquiry(lead_id):
    db = require_db()
    if db.inquiries.delete_one(id_query(lead_id)).deleted_count == 0:
        raise ApiError("Enquiry not found.", 404)
    return jsonify({"message": "Enquiry deleted."}), 200
