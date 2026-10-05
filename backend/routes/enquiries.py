"""
Zeilan Paradise — Inquiries & Enquiries Routes
POST /api/inquiries  — Public: Submit a bespoke tailor-made journey inquiry
POST /api/enquiries  — Public: Submit general contact enquiry
GET  /api/admin/enquiries — Protected: View all leads & inquiries
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from datetime import datetime, timezone
import html
import re
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import threading
from db import get_db

enquiries_bp = Blueprint('enquiries', __name__)

EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')

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


def _lead_email_html(data):
    e = lambda v: html.escape(str(v if v not in (None, "") else "N/A"))
    contact = data.get('contact') or {}
    name = data.get('clientName') or {}
    trip = data.get('tripDetails') or {}
    prefs = data.get('preferences') or {}
    travellers = trip.get('travelers') or {}
    full_name = f"{name.get('firstName', data.get('firstName', ''))} {name.get('lastName', data.get('lastName', ''))}".strip()

    rows = [
        ("Form", "Tailor-made planner" if trip else "Contact form"),
        ("Name", full_name),
        ("Email", contact.get('email', data.get('email'))),
        ("Phone / WhatsApp", contact.get('phone', data.get('phone'))),
        ("Interested in", data.get('interest')),
        ("Travel dates", trip.get('estimatedMonth', data.get('travelDates'))),
        ("Duration", f"{trip['durationDays']} days" if trip.get('durationDays') else None),
        ("Travellers", f"{travellers.get('adults', 0)} adults, {travellers.get('children', 0)} children" if travellers else data.get('guests')),
        ("Accommodation", trip.get('accommodationStyle')),
        ("Interests", ", ".join(prefs.get('interests', []))),
        ("Regions", ", ".join(prefs.get('regions', []))),
        ("Pace", prefs.get('pace')),
        ("Planning stage", data.get('planningStage')),
        ("Message", data.get('additionalNotes') or data.get('message')),
    ]
    body = "".join(
        f'<tr><td style="padding:6px 12px;color:#666;vertical-align:top">{e(k)}</td>'
        f'<td style="padding:6px 12px;white-space:pre-wrap">{e(v)}</td></tr>'
        for k, v in rows if v
    )
    return (f'<html><body style="font-family:Arial,sans-serif;color:#222">'
            f'<h2 style="color:#005b52">New enquiry</h2><table>{body}</table></body></html>')


def send_lead_email_async(data):
    def send_email():
        sender = _env("SMTP_USER", "MAIL_USERNAME")
        password = _env("SMTP_PASS", "MAIL_PASSWORD")
        recipient = _env("ADMIN_NOTIFICATION_EMAIL", "ADMIN_EMAIL")
        if not (sender and password and recipient):
            print("[INFO] Email not configured (SMTP_USER/SMTP_PASS/ADMIN_NOTIFICATION_EMAIL). Skipping.")
            return

        contact = data.get('contact') or {}
        name = data.get('clientName') or {}
        first = name.get('firstName') or data.get('firstName', '')
        reply_to = contact.get('email') or data.get('email')

        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"New enquiry from {first}".strip()
        msg["From"] = _env("EMAIL_FROM", default=sender)
        msg["To"] = recipient
        if reply_to:
            msg["Reply-To"] = reply_to
        msg.attach(MIMEText(_lead_email_html(data), "html"))

        try:
            host = _env("SMTP_HOST", "MAIL_SERVER", default="smtp.gmail.com")
            port = int(_env("SMTP_PORT", "MAIL_PORT", default="587"))
            with smtplib.SMTP(host, port, timeout=20) as server:
                server.starttls()
                server.login(sender, password)
                server.send_message(msg)
            print("[INFO] Lead notification email sent.")
        except Exception as e:
            print(f"[ERROR] Failed to send email: {e}")

    # Start thread to avoid blocking the API response
    thread = threading.Thread(target=send_email)
    thread.daemon = True
    thread.start()


@enquiries_bp.route('/api/inquiries', methods=['POST'])
@enquiries_bp.route('/api/enquiries', methods=['POST'])
def submit_inquiry():
    """
    Public endpoint to submit a bespoke travel inquiry or contact form.
    Saves to the dedicated 'inquiries' collection in MongoDB Atlas.
    """
    db = get_db()
    data = request.get_json()

    if not data:
        return jsonify({"error": "Inquiry payload is required."}), 400

    # Handle both nested schema (clientName, contact) and flat schema (firstName, lastName, email)
    first_name = ""
    last_name = ""
    email = ""

    if isinstance(data.get('clientName'), dict):
        first_name = data['clientName'].get('firstName', '').strip()
        last_name = data['clientName'].get('lastName', '').strip()
    else:
        first_name = data.get('firstName', '').strip()
        last_name = data.get('lastName', '').strip()

    if isinstance(data.get('contact'), dict):
        email = data['contact'].get('email', '').strip()
    else:
        email = data.get('email', '').strip()

    if not first_name or not email:
        return jsonify({"error": "First name and email are required."}), 400
    if not EMAIL_RE.match(email):
        return jsonify({"error": "Please enter a valid email address."}), 400

    # Honeypot: real visitors never see or fill the hidden "website" field.
    if data.pop('website', ''):
        return jsonify({"message": "Thank you."}), 201

    # Ensure standardized fields
    now_iso = datetime.now(timezone.utc).isoformat()
    if 'submittedAt' not in data:
        data['submittedAt'] = now_iso
    if 'createdAt' not in data:
        data['createdAt'] = now_iso
    if 'status' not in data:
        data['status'] = 'New Lead'

    if db is not None:
        try:
            db.inquiries.insert_one(data)
            data.pop('_id', None)
            # Dispatch email notification
            send_lead_email_async(data)
        except Exception as e:
            print(f"[ERROR] Failed to save inquiry to MongoDB: {e}")
            return jsonify({"error": "Failed to store inquiry in database."}), 500
    elif email_configured():
        # No database: the email notification is the only record, so it must be configured.
        send_lead_email_async(data)
    else:
        print("[ERROR] Inquiry received but neither MongoDB nor email is available; it cannot be stored.")
        return jsonify({"error": "We couldn't receive your enquiry right now. Please contact us directly."}), 503

    return jsonify({
        "message": "Thank you. Our destination experts will review your preferences and craft your bespoke itinerary within 24 hours.",
        "inquiry": data
    }), 201


@enquiries_bp.route('/api/admin/enquiries', methods=['GET'])
@enquiries_bp.route('/api/admin/inquiries', methods=['GET'])
@jwt_required()
def get_admin_inquiries():
    """
    Protected endpoint to fetch all inquiries.
    Returns them sorted by submission date (newest first).
    """
    db = get_db()
    if db is None:
        return jsonify([]), 200

    inquiries_cursor = db.inquiries.find({}, {"_id": 0}).sort("submittedAt", -1)
    inquiries_list = list(inquiries_cursor)

    return jsonify(inquiries_list), 200
