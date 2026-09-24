"""
Zeilan Paradise — Enquiries Routes
POST /api/enquiries — Public: Submit a new contact or tailor-made enquiry.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from datetime import datetime, timezone
from db import get_db

enquiries_bp = Blueprint('enquiries', __name__)

@enquiries_bp.route('/api/enquiries', methods=['POST'])
def submit_enquiry():
    """
    Public endpoint to submit a new enquiry.
    Accepts data from both the Contact and Tailor-Made forms.
    """
    db = get_db()
    if db is None:
        return jsonify({"error": "Database connection failed. Cannot save enquiry."}), 503

    data = request.get_json()
    if not data:
        return jsonify({"error": "Enquiry data is required."}), 400

    required_fields = ['firstName', 'lastName', 'email']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"Missing required field: {field}"}), 400

    # Add timestamp
    data['createdAt'] = datetime.now(timezone.utc).isoformat()
    data['status'] = 'New'

    # Insert into database collection "inquiries"
    db.inquiries.insert_one(data)
    data.pop('_id', None)  # Remove ObjectId before returning

    return jsonify({
        "message": "Enquiry received successfully.",
        "enquiry": data
    }), 201


@enquiries_bp.route('/api/admin/enquiries', methods=['GET'])
@jwt_required()
def get_admin_enquiries():
    """
    Protected endpoint to fetch all enquiries/inquiries.
    Returns them sorted by creation date (newest first).
    """
    db = get_db()
    if db is None:
        return jsonify([]), 200

    # Query 'inquiries' collection, sort by createdAt descending
    inquiries_cursor = db.inquiries.find({}, {"_id": 0}).sort("createdAt", -1)
    inquiries_list = list(inquiries_cursor)

    return jsonify(inquiries_list), 200
