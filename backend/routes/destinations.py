"""
Zeilan Paradise — Destinations Routes
GET  /api/destinations   — Public: List destinations from MongoDB Atlas
GET  /api/destinations/<id> — Public: Get single destination by id
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
    Public endpoint to retrieve destinations from live MongoDB Atlas.
    Query params:
        - region: Filter by region name
        - tag: Filter by tag name
        - featured: 'true' | 'false'
    """
    db = get_db()

    query = {"isActive": {"$ne": False}}

    region = request.args.get('region')
    if region:
        query["region"] = region

    tag = request.args.get('tag')
    if tag:
        query["tags"] = {"$in": [tag]}

    featured = request.args.get('featured')
    if featured == 'true':
        query["featured"] = True

    if db is None:
        destinations = FALLBACK_DESTINATIONS
        if region:
            destinations = [d for d in destinations if d.get('region') == region]
        if tag:
            destinations = [d for d in destinations if tag in d.get('tags', [])]
        if featured == 'true':
            destinations = [d for d in destinations if d.get('featured') is True]
    else:
        destinations = list(db.destinations.find(query, {"_id": 0}))

    return jsonify(destinations), 200


@destinations_bp.route('/api/destinations/<destination_id>', methods=['GET'])
def get_destination_by_id(destination_id):
    """Retrieve single destination by ID or slug."""
    db = get_db()
    if db is not None:
        doc = db.destinations.find_one({
            "$or": [{"id": destination_id}, {"name": destination_id}]
        }, {"_id": 0})
        if doc:
            return jsonify(doc), 200

    for d in FALLBACK_DESTINATIONS:
        if d.get('id') == destination_id or d.get('name') == destination_id:
            return jsonify(d), 200

    return jsonify({"error": "Destination not found"}), 404


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

    required_fields = ['name', 'tagline']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    if 'isActive' not in data:
        data['isActive'] = True

    db.destinations.insert_one(data)
    data.pop('_id', None)

    return jsonify({"message": "Destination created successfully.", "destination": data}), 201
