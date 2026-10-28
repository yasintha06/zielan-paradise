"""
Zeilan Paradise — Enquiries (contact form + journey planner)
Public:  POST /api/enquiries  (alias /api/inquiries)
Admin:   GET /api/admin/inquiries · PATCH/DELETE /api/admin/inquiries/<id>

Every enquiry is stored in one shape:
  { id, kind: 'planner'|'contact'|'agent', firstName, lastName, email, phone, company (agents),
    interest, travelDates, guests, message, trip: {...}, status, notes, createdAt }

Emails: every enquiry notifies the business (ADMIN_NOTIFICATION_EMAIL, default info@zeilanparadise.com).
Agent enquiries also get a plain confirmation email, limited per sender address and per IP to stop abuse.
Older records in other shapes are converted when read.
"""
import html
import os
import re
import smtplib
import threading
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from api_utils import ApiError, id_query, new_id, now_iso, public, require_db
from db import get_db

enquiries_bp = Blueprint('enquiries', __name__)

EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
BUSINESS_EMAIL = 'info@zeilanparadise.com'
KIND_LABELS = {'planner': 'Journey planner', 'contact': 'Enquiry', 'agent': 'Agent enquiry'}
STATUSES = ['New', 'Contacted', 'Proposal sent', 'Booked', 'Closed']


def _s(value, limit=300):
    return str(value if value is not None else '').strip()[:limit]


def _line(value, limit):
    """Single-line text (names, phone): no line breaks, which could reach email headers."""
    return re.sub(r'[\x00-\x1f\x7f]+', ' ', _s(value, limit)).strip()


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
    is_agent = 'agent' in (raw.get('kind'), raw.get('type'))
    is_planner = not is_agent and (raw.get('kind') == 'planner' or bool(raw.get('tripDetails')) or bool(name))

    lead = {
        'kind': 'agent' if is_agent else 'planner' if is_planner else 'contact',
        'firstName': _line(name.get('firstName', raw.get('firstName')), 80),
        'lastName': _line(name.get('lastName', raw.get('lastName')), 80),
        'email': _line(contact.get('email', raw.get('email')), 200),
        'phone': _line(contact.get('phone', raw.get('phone')), 40),
        'interest': _s(raw.get('interest'), 120),
        'travelDates': _s(raw.get('travelDates'), 120),
        'guests': _s(raw.get('guests'), 120),
        'message': _s(raw.get('additionalNotes', raw.get('message')), 4000),
    }
    if is_agent:
        lead['company'] = _line(raw.get('company'), 120)
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
    return bool(_env("SMTP_USER", "MAIL_USERNAME") and _env("SMTP_PASS", "SMTP_PASSWORD", "MAIL_PASSWORD"))


def _business_inbox():
    return _env("ADMIN_NOTIFICATION_EMAIL", "ADMIN_EMAIL", default=BUSINESS_EMAIL)


def _lead_email_html(lead):
    e = lambda v: html.escape(str(v))
    trip = lead.get('trip') or {}
    rows = [
        ("Form", {'planner': "Journey planner", 'agent': "Travel agent form"}.get(lead['kind'], "Contact form")),
        ("Name", f"{lead['firstName']} {lead['lastName']}".strip()),
        ("Company", lead.get('company')),
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
        ("Tours or dates" if lead['kind'] == 'agent' else "Message", lead['message']),
    ]
    body = "".join(
        f'<tr><td style="padding:6px 12px;color:#666;vertical-align:top">{e(k)}</td>'
        f'<td style="padding:6px 12px;white-space:pre-wrap">{e(v)}</td></tr>'
        for k, v in rows if v
    )
    return (f'<html><body style="font-family:Arial,sans-serif;color:#222">'
            f'<h2 style="color:#005b52">New enquiry</h2><table>{body}</table>'
            f'<p style="color:#888;font-size:12px">Reply to this email to answer them directly.</p></body></html>')


def build_notification(lead):
    """The email the business receives for every enquiry."""
    msg = MIMEMultipart("alternative")
    name = f"{lead['firstName']} {lead['lastName']}".strip()
    company = f" ({lead['company']})" if lead.get('company') else ''
    msg["Subject"] = f"{KIND_LABELS.get(lead['kind'], 'Enquiry')}: {name}{company}"
    msg["To"] = _business_inbox()
    if lead.get('email'):
        msg["Reply-To"] = lead['email']
    msg.attach(MIMEText(_lead_email_html(lead), "html"))
    return msg


def build_confirmation(lead):
    """Plain-text receipt for the person who sent an agent enquiry. It never repeats their message,
    so the form can't be used to send someone else arbitrary text."""
    name = f"{lead['firstName']} {lead['lastName']}".strip()
    msg = MIMEText(
        f"Dear {name},\n\n"
        "Thank you for contacting Zeilan Paradise. This email confirms that we have received "
        "your travel agent enquiry.\n\n"
        "We will reply to this email address. If you would like to add anything, simply reply to this email.\n\n"
        "Zeilan Paradise\n"
        f"{BUSINESS_EMAIL}\n"
        "+44 7818 792995\n"
        "https://zeilanparadise.com\n\n"
        "You are receiving this because this email address was entered on the travel agent form at "
        "zeilanparadise.com. If this was not you, please ignore this email.\n",
        "plain", "utf-8")
    msg["Subject"] = "We have received your enquiry | Zeilan Paradise"
    msg["To"] = lead['email']
    msg["Reply-To"] = _business_inbox()
    return msg


def _send(messages):
    sender = _env("SMTP_USER", "MAIL_USERNAME")
    password = _env("SMTP_PASS", "SMTP_PASSWORD", "MAIL_PASSWORD")
    if not (sender and password):
        print("[INFO] Email not configured (SMTP_USER/SMTP_PASS). Skipping.")
        return
    try:
        host = _env("SMTP_HOST", "MAIL_SERVER", default="mail.privateemail.com")
        port = int(_env("SMTP_PORT", "MAIL_PORT", default="587"))
        with smtplib.SMTP(host, port, timeout=20) as server:
            server.starttls()
            server.login(sender, password)
            for msg in messages:
                msg["From"] = _env("EMAIL_FROM", default=sender)
                server.send_message(msg)
        print(f"[INFO] Sent {len(messages)} enquiry email(s).")
    except Exception as e:
        print(f"[ERROR] Failed to send email: {e}")


# Confirmation emails go to an address typed into a public form, so cap them (per server process).
_CONFIRM_LIMIT = 3
_CONFIRM_WINDOW = 3600
_confirm_log = {}


def _confirmation_allowed(*keys):
    now = time.time()
    for key in keys:
        _confirm_log[key] = [t for t in _confirm_log.get(key, []) if now - t < _CONFIRM_WINDOW]
        if len(_confirm_log[key]) >= _CONFIRM_LIMIT:
            return False
    for key in keys:
        _confirm_log[key].append(now)
    return True


def emails_for(lead, ip=''):
    """Every email an enquiry triggers: the business notification, plus a receipt for agents."""
    messages = [build_notification(lead)]
    if lead['kind'] == 'agent' and _confirmation_allowed('email:' + lead['email'].lower(), 'ip:' + ip):
        messages.append(build_confirmation(lead))
    return messages


def send_lead_email_async(lead, ip=''):
    messages = emails_for(lead, ip)
    # Send in the background so the visitor isn't kept waiting.
    threading.Thread(target=_send, args=(messages,), daemon=True).start()


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
    if lead['kind'] == 'agent' and not lead.get('company'):
        raise ApiError("Please add your company name.")
    if not EMAIL_RE.match(lead['email']):
        raise ApiError("Please enter a valid email address.")

    lead.update(id=new_id('enq'), status='New', notes='', createdAt=now_iso())
    ip = (request.headers.get('X-Forwarded-For') or request.remote_addr or '').split(',')[0].strip()

    db = get_db()
    if db is not None:
        try:
            db.inquiries.insert_one(dict(lead))
        except Exception as e:
            print(f"[ERROR] Failed to save enquiry to MongoDB: {e}")
            if not email_configured():
                raise ApiError("We couldn't receive your enquiry right now. Please contact us directly.", 503)
        send_lead_email_async(lead, ip)
    elif email_configured():
        # No database: the email notification is the only record.
        send_lead_email_async(lead, ip)
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
