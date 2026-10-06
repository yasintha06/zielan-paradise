"""
Zeilan Paradise — Tours
Public:  GET /api/tours  (?type=round|day, ?category=, ?featured=true)
         GET /api/tours/<id>
Admin:   GET /api/admin/tours · POST /api/admin/tours
         PUT /api/admin/tours/<id> · DELETE /api/admin/tours/<id>
"""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from api_utils import ApiError, clean, public, require_db, slugify
from catalog_data import CATALOG_TOURS
from db import get_db

tours_bp = Blueprint('tours', __name__)

TOUR_SCHEMA = {
    'title': 'str', 'type': 'str', 'category': 'str', 'duration': 'str', 'bestTime': 'str',
    'description': 'text', 'targetAudience': 'str', 'route': 'str', 'image': 'str',
    'badge': 'badge', 'priceType': 'str', 'priceDisplay': 'str', 'guests': 'str', 'startTime': 'str',
    'highlights': 'strlist', 'itinerary': 'itinerary', 'inclusions': 'strlist', 'exclusions': 'strlist',
    'featured': 'bool', 'isActive': 'bool', 'market': 'str', 'sortOrder': 'int',
}


def _filter(tours):
    tour_type = request.args.get('type')
    category = request.args.get('category')
    featured = request.args.get('featured')
    if tour_type:
        tours = [t for t in tours if t.get('type') == tour_type]
    if category and category != 'all':
        tours = [t for t in tours if t.get('category') == category]
    if featured == 'true':
        tours = [t for t in tours if t.get('featured') is True]
    return tours


def _sorted(tours):
    return sorted(tours, key=lambda t: (t.get('sortOrder') if t.get('sortOrder') is not None else 999))


@tours_bp.route('/api/tours', methods=['GET'])
def list_tours():
    db = get_db()
    if db is None:
        tours = list(CATALOG_TOURS)
    else:
        tours = [public(t) for t in db.tours.find({"isActive": {"$ne": False}})]
    return jsonify(_sorted(_filter(tours))), 200


@tours_bp.route('/api/tours/<string:tour_id>', methods=['GET'])
def get_tour(tour_id):
    db = get_db()
    if db is None:
        tour = next((t for t in CATALOG_TOURS if t.get('id') == tour_id), None)
    else:
        tour = public(db.tours.find_one({"id": tour_id, "isActive": {"$ne": False}}))
    if not tour:
        return jsonify({"error": "Tour not found."}), 404
    return jsonify(tour), 200


# ── Admin ────────────────────────────────────────────────────
@tours_bp.route('/api/admin/tours', methods=['GET'])
@jwt_required()
def admin_list_tours():
    db = require_db()
    return jsonify(_sorted([public(t) for t in db.tours.find()])), 200


@tours_bp.route('/api/admin/tours', methods=['POST'])
@jwt_required()
def admin_create_tour():
    db = require_db()
    data = clean(request.get_json(silent=True), TOUR_SCHEMA, partial=True)
    if not data.get('title'):
        raise ApiError("A title is required.")
    data.setdefault('type', 'round')
    data.setdefault('isActive', True)
    data.setdefault('market', 'uk')
    base = f"{'day-tour' if data['type'] == 'day' else 'tour'}-{slugify(data['title'])}"
    tour_id, n = base, 2
    while db.tours.find_one({"id": tour_id}):
        tour_id, n = f"{base}-{n}", n + 1
    data['id'] = tour_id
    db.tours.insert_one(data)
    return jsonify(public(data)), 201


@tours_bp.route('/api/admin/tours/<string:tour_id>', methods=['PUT'])
@jwt_required()
def admin_update_tour(tour_id):
    db = require_db()
    data = clean(request.get_json(silent=True), TOUR_SCHEMA, partial=True)
    if 'title' in data and not data['title']:
        raise ApiError("A title is required.")
    result = db.tours.update_one({"id": tour_id}, {"$set": data})
    if result.matched_count == 0:
        raise ApiError("Tour not found.", 404)
    return jsonify(public(db.tours.find_one({"id": tour_id}))), 200


@tours_bp.route('/api/admin/tours/<string:tour_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_tour(tour_id):
    db = require_db()
    if db.tours.delete_one({"id": tour_id}).deleted_count == 0:
        raise ApiError("Tour not found.", 404)
    return jsonify({"message": "Tour deleted."}), 200
