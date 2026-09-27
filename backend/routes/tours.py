"""
═══════════════════════════════════════════════════════════════
  ZEILAN PARADISE — Tours REST API Routes (PyMongo CRUD)
  Data Model:
  {
    "id": "tour-cultural-triangle",
    "title": "String",
    "description": "String",
    "duration": "String",
    "guests": "String",
    "route": "String",
    "category": "String",
    "type": "round" | "day",
    "badge": { "text": "String", "class": "String" },
    "image": "String",
    "priceType": "String",
    "priceDisplay": "String",
    "highlights": ["Array of Strings"]
  }
═══════════════════════════════════════════════════════════════
"""
import re
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from db import get_db
from fallback_data import FALLBACK_TOURS

tours_bp = Blueprint('tours', __name__)


def _slugify(text: str) -> str:
    """Helper to create a URL-friendly slug ID."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    return re.sub(r'[-\s]+', '-', text)


# ── GET ALL TOURS (with filters) ──────────────────────────────
@tours_bp.route('/api/tours', methods=['GET'])
def get_tours():
    """
    Fetch all tours from MongoDB with optional filtering.
    Query params:
        - type: 'round' | 'day'
        - category: 'cultural' | 'wildlife' | 'coast' | 'highlands' | 'safari' | 'wellness' | 'adventure'
        - market: 'uk' (default: all or matched)
        - featured: 'true' | 'false'
    """
    db = get_db()

    tour_type = request.args.get('type')
    category = request.args.get('category')
    market = request.args.get('market')
    featured = request.args.get('featured')

    if db is None:
        # Fallback to in-memory dataset
        tours = list(FALLBACK_TOURS)
        if tour_type:
            tours = [t for t in tours if t.get('type') == tour_type or t.get('category') == tour_type]
        if category and category != 'all':
            tours = [t for t in tours if t.get('category') == category]
        if market:
            tours = [t for t in tours if t.get('market', 'uk') == market]
        if featured == 'true':
            tours = [t for t in tours if t.get('featured') is True]
        return jsonify(tours), 200

    query = {}
    if tour_type:
        # Support matching by explicit type field or category alias
        query["$or"] = [
            {"type": tour_type},
            {"category": tour_type}
        ]
    if category and category != 'all':
        query["category"] = category
    if market:
        query["market"] = market
    if featured == 'true':
        query["featured"] = True
    elif featured == 'false':
        query["featured"] = False

    tours = list(db.tours.find(query, {"_id": 0}))
    return jsonify(tours), 200


# ── GET SINGLE TOUR BY ID ─────────────────────────────────────
@tours_bp.route('/api/tours/<string:tour_id>', methods=['GET'])
def get_tour_by_id(tour_id):
    """Retrieve a single tour by its string ID."""
    db = get_db()
    if db is None:
        tour = next((t for t in FALLBACK_TOURS if t.get('id') == tour_id), None)
        if tour:
            return jsonify(tour), 200
        return jsonify({"error": f"Tour with ID '{tour_id}' not found."}), 404

    tour = db.tours.find_one({"id": tour_id}, {"_id": 0})
    if not tour:
        return jsonify({"error": f"Tour with ID '{tour_id}' not found."}), 404

    return jsonify(tour), 200


# ── POST: CREATE NEW TOUR ─────────────────────────────────────
@tours_bp.route('/api/tours', methods=['POST'])
def create_tour():
    """
    Insert a new tour document into the collection adhering to the required schema.
    """
    db = get_db()
    if db is None:
        return jsonify({"error": "Database not available."}), 503

    data = request.get_json()
    if not data:
        return jsonify({"error": "Tour JSON payload is required."}), 400

    # Validate required fields
    required_fields = ['title', 'description', 'duration', 'priceDisplay']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"Missing required field: '{field}'."}), 400

    # Build standardized document adhering to the exact schema
    tour_id = data.get('id') or f"tour-{_slugify(data['title'])}"
    
    # Check if ID already exists
    if db.tours.find_one({"id": tour_id}):
        return jsonify({"error": f"A tour with ID '{tour_id}' already exists."}), 409

    badge = data.get('badge')
    if not isinstance(badge, dict):
        badge = {"text": data.get('duration', 'Curated'), "class": "bg-gold"}

    highlights = data.get('highlights')
    if not isinstance(highlights, list):
        highlights = [h.strip() for h in str(highlights or '').split(',') if h.strip()]

    tour_doc = {
        "id": tour_id,
        "title": str(data['title']),
        "description": str(data['description']),
        "duration": str(data['duration']),
        "guests": str(data.get('guests', '2–8 Guests')),
        "route": str(data.get('route', 'Sri Lanka Circuit')),
        "category": str(data.get('category', 'cultural')),
        "type": str(data.get('type', 'round')),
        "badge": {
            "text": str(badge.get('text', 'Featured')),
            "class": str(badge.get('class', ''))
        },
        "image": str(data.get('image', 'images/tours/tour-cultural-triangle.jpg')),
        "priceType": str(data.get('priceType', 'From')),
        "priceDisplay": str(data['priceDisplay']),
        "highlights": highlights,
        "featured": bool(data.get('featured', False)),
        "market": str(data.get('market', 'uk'))
    }

    db.tours.insert_one(tour_doc)
    tour_doc.pop('_id', None)

    return jsonify({
        "message": "Tour created successfully.",
        "tour": tour_doc
    }), 201


# ── PUT: UPDATE EXISTING TOUR ─────────────────────────────────
@tours_bp.route('/api/tours/<string:tour_id>', methods=['PUT'])
def update_tour(tour_id):
    """
    Update an existing tour document using its string ID.
    """
    db = get_db()
    if db is None:
        return jsonify({"error": "Database not available."}), 503

    data = request.get_json()
    if not data:
        return jsonify({"error": "Update JSON payload is required."}), 400

    # Ensure _id is never modified
    data.pop('_id', None)
    data.pop('id', None)  # Prevent ID mutation

    # Normalize badge and highlights if provided
    if 'badge' in data and not isinstance(data['badge'], dict):
        data['badge'] = {"text": str(data['badge']), "class": ""}
    if 'highlights' in data and not isinstance(data['highlights'], list):
        data['highlights'] = [h.strip() for h in str(data['highlights']).split(',') if h.strip()]

    result = db.tours.update_one({"id": tour_id}, {"$set": data})

    if result.matched_count == 0:
        return jsonify({"error": f"Tour with ID '{tour_id}' not found."}), 404

    updated_tour = db.tours.find_one({"id": tour_id}, {"_id": 0})
    return jsonify({
        "message": f"Tour '{tour_id}' updated successfully.",
        "tour": updated_tour
    }), 200


# ── DELETE: REMOVE TOUR ───────────────────────────────────────
@tours_bp.route('/api/tours/<string:tour_id>', methods=['DELETE'])
def delete_tour(tour_id):
    """
    Remove a tour document from the collection by its string ID.
    """
    db = get_db()
    if db is None:
        return jsonify({"error": "Database not available."}), 503

    result = db.tours.delete_one({"id": tour_id})

    if result.deleted_count == 0:
        return jsonify({"error": f"Tour with ID '{tour_id}' not found."}), 404

    return jsonify({
        "message": f"Tour '{tour_id}' removed successfully."
    }), 200
