"""
Zeilan Paradise — Tours Routes
GET  /api/tours          — Public: List tours (filterable by type, market, featured)
POST /api/tours          — Protected: Create a new tour (JWT required)
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from db import get_db
from fallback_data import FALLBACK_TOURS

tours_bp = Blueprint('tours', __name__)


@tours_bp.route('/api/tours', methods=['GET'])
def get_tours():
    """
    Public endpoint to retrieve tours.
    Query params:
        - type: 'round' | 'day'
        - market: 'uk' (default)
        - featured: 'true' | 'false'
    """
    db = get_db()

    if db is None:
        # Fallback to in-memory data
        tours = FALLBACK_TOURS
    else:
        tours = list(db.tours.find({}, {"_id": 0}))

    # Apply filters
    tour_type = request.args.get('type')
    market = request.args.get('market', 'uk')
    featured = request.args.get('featured')

    if tour_type:
        tours = [t for t in tours if t.get('type') == tour_type]
    if market:
        tours = [t for t in tours if t.get('market') == market]
    if featured == 'true':
        tours = [t for t in tours if t.get('featured') is True]

    return jsonify(tours), 200


@tours_bp.route('/api/tours', methods=['POST'])
@jwt_required()
def create_tour():
    """
    Protected endpoint to create a new tour.
    Requires a valid JWT token in the Authorization header.
    """
    db = get_db()
    if db is None:
        return jsonify({"error": "Database not available."}), 503

    data = request.get_json()
    if not data:
        return jsonify({"error": "Tour data is required."}), 400

    required_fields = ['title', 'description', 'duration', 'priceDisplay', 'type']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    db.tours.insert_one(data)
    # Remove the MongoDB _id before returning
    data.pop('_id', None)

    return jsonify({"message": "Tour created successfully.", "tour": data}), 201
