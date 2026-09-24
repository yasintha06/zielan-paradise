"""
Zeilan Paradise — Destinations Routes
GET  /api/destinations   — Public: List destinations
POST /api/destinations   — Protected: Create a destination (JWT required)
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from db import get_db
from fallback_data import FALLBACK_DESTINATIONS

destinations_bp = Blueprint('destinations', __name__)


@destinations_bp.route('/api/destinations', methods=['GET'])
def get_destinations():
    """
    Public endpoint to retrieve destinations.
    Query params:
        - featured: 'true' | 'false'
    """
    db = get_db()

    if db is None:
        destinations = FALLBACK_DESTINATIONS
    else:
        destinations = list(db.destinations.find({}, {"_id": 0}))

    featured = request.args.get('featured')
    if featured == 'true':
        destinations = [d for d in destinations if d.get('featured') is True]

    return jsonify(destinations), 200


@destinations_bp.route('/api/destinations', methods=['POST'])
@jwt_required()
def create_destination():
    """Protected endpoint to create a new destination."""
    db = get_db()
    if db is None:
        return jsonify({"error": "Database not available."}), 503

    data = request.get_json()
    if not data:
        return jsonify({"error": "Destination data is required."}), 400

    required_fields = ['name', 'tagline', 'image']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    db.destinations.insert_one(data)
    data.pop('_id', None)

    return jsonify({"message": "Destination created successfully.", "destination": data}), 201
