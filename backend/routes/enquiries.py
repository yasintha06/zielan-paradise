"""
Zeilan Paradise — Inquiries & Enquiries Routes
POST /api/inquiries  — Public: Submit a bespoke tailor-made journey inquiry
POST /api/enquiries  — Public: Submit general contact enquiry
GET  /api/admin/enquiries — Protected: View all leads & inquiries
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from datetime import datetime, timezone
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import threading
from db import get_db

enquiries_bp = Blueprint('enquiries', __name__)

def send_lead_email_async(data):
    def send_email():
        sender_email = os.environ.get("MAIL_USERNAME")
        sender_password = os.environ.get("MAIL_PASSWORD")
        recipient_email = os.environ.get("ADMIN_EMAIL")
        
        if not sender_email or not sender_password or not recipient_email:
            print("[INFO] Email credentials not fully configured in .env. Skipping email dispatch.")
            return

        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"New Lead: {data.get('status', 'Bespoke Inquiry')} from {data.get('clientName', {}).get('firstName', '')}"
        msg["From"] = sender_email
        msg["To"] = recipient_email

        # Format HTML body
        client_name = f"{data.get('clientName', {}).get('firstName', '')} {data.get('clientName', {}).get('lastName', '')}".strip() or data.get('firstName', 'Unknown')
        contact = data.get('contact', {})
        email = contact.get('email', data.get('email', 'N/A'))
        phone = contact.get('phone', data.get('phone', 'N/A'))
        
        trip = data.get('tripDetails', {})
        prefs = data.get('preferences', {})
        
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #005b52;">New Lead Summary Sheet</h2>
            <hr>
            <h3>Client Details</h3>
            <p><strong>Name:</strong> {client_name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>
            
            <h3>Trip Details</h3>
            <p><strong>Estimated Month:</strong> {trip.get('estimatedMonth', 'N/A')}</p>
            <p><strong>Duration:</strong> {trip.get('durationDays', 'N/A')} Days</p>
            <p><strong>Accommodation Style:</strong> {trip.get('accommodationStyle', 'N/A')}</p>
            
            <h3>Preferences</h3>
            <p><strong>Regions:</strong> {', '.join(prefs.get('regions', []))}</p>
            <p><strong>Interests:</strong> {', '.join(prefs.get('interests', []))}</p>
            <p><strong>Pace:</strong> {prefs.get('pace', 'N/A')}</p>
            
            <h3>Planning Stage</h3>
            <p>{data.get('planningStage', 'N/A')}</p>
            <p><strong>Notes / Message:</strong> {data.get('additionalNotes', data.get('message', 'None'))}</p>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html, "html"))
        
        try:
            # Connect to SMTP (Example using Gmail / generic TLS)
            smtp_server = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
            smtp_port = int(os.environ.get("MAIL_PORT", 587))
            
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(sender_email, sender_password)
                server.send_message(msg)
            print("[INFO] Lead notification email dispatched successfully.")
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
    else:
        data.pop('_id', None)

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
