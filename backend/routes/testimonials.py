"""
Zeilan Paradise — Testimonials Routes
GET  /api/testimonials   — Public: List testimonials (filterable by market)
POST /api/testimonials   — Protected: Create a testimonial (JWT required)
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from db import get_db
from fallback_data import FALLBACK_TESTIMONIALS

testimonials_bp = Blueprint('testimonials', __name__)


@testimonials_bp.route('/api/testimonials', methods=['GET'])
def get_testimonials():
    """
    Public endpoint to retrieve testimonials.
    Query params:
        - market: 'uk' (default)
    """
    db = get_db()

    if db is None:
        testimonials = FALLBACK_TESTIMONIALS
    else:
        testimonials = list(db.testimonials.find({}, {"_id": 0}))

    market = request.args.get('market', 'uk')
    if market:
        testimonials = [t for t in testimonials if t.get('market') == market]

    return jsonify(testimonials), 200


@testimonials_bp.route('/api/testimonials', methods=['POST'])
@jwt_required()
def create_testimonial():
    """Protected endpoint to create a new testimonial."""
    db = get_db()
    if db is None:
        return jsonify({"error": "Database not available."}), 503

    data = request.get_json()
    if not data:
        return jsonify({"error": "Testimonial data is required."}), 400

    required_fields = ['text', 'authorName', 'authorLocation']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    db.testimonials.insert_one(data)
    data.pop('_id', None)

    return jsonify({"message": "Testimonial created successfully.", "testimonial": data}), 201
