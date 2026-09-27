"""
Zeilan Paradise — Inquiries & Enquiries Routes
POST /api/inquiries  — Public: Submit a bespoke tailor-made journey inquiry
POST /api/enquiries  — Public: Submit general contact enquiry
GET  /api/admin/enquiries — Protected: View all leads & inquiries
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from datetime import datetime, timezone
from db import get_db

enquiries_bp = Blueprint('enquiries', __name__)


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
