"""
Zeilan Paradise — Destinations
Public:  GET /api/destinations (?region=, ?tag=) · GET /api/destinations/<id>
Admin:   GET/POST /api/admin/destinations · PUT/DELETE /api/admin/destinations/<id>
"""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from api_utils import ApiError, clean, public, require_db, slugify
from catalog_data import CATALOG_DESTINATIONS
from db import get_db

destinations_bp = Blueprint('destinations', __name__)

DESTINATION_SCHEMA = {
    'name': 'str', 'tagline': 'str', 'description': 'text', 'region': 'str',
    'tags': 'strlist', 'imageUrl': 'str', 'featured': 'bool', 'isActive': 'bool', 'sortOrder': 'int',
}


def _ensure_id(d):
    d = public(d)
    if d and not d.get('id'):
        d['id'] = 'dest-' + slugify(d.get('name', ''))
    return d


def _sorted(items):
    return sorted(items, key=lambda d: (d.get('sortOrder') if d.get('sortOrder') is not None else 999))


@destinations_bp.route('/api/destinations', methods=['GET'])
def list_destinations():
    db = get_db()
    if db is None:
        items = list(CATALOG_DESTINATIONS)
    else:
        items = [_ensure_id(d) for d in db.destinations.find({"isActive": {"$ne": False}})]
    region = request.args.get('region')
    tag = request.args.get('tag')
    if region:
        items = [d for d in items if d.get('region') == region]
    if tag:
        items = [d for d in items if tag in (d.get('tags') or [])]
    return jsonify(_sorted(items)), 200


@destinations_bp.route('/api/destinations/<destination_id>', methods=['GET'])
def get_destination(destination_id):
    db = get_db()
    items = list(CATALOG_DESTINATIONS) if db is None else [_ensure_id(d) for d in db.destinations.find()]
    match = next((d for d in items if destination_id in (d.get('id'), d.get('name'))), None)
    if not match:
        return jsonify({"error": "Destination not found."}), 404
    return jsonify(match), 200


# ── Admin ────────────────────────────────────────────────────
@destinations_bp.route('/api/admin/destinations', methods=['GET'])
@jwt_required()
def admin_list_destinations():
    db = require_db()
    return jsonify(_sorted([_ensure_id(d) for d in db.destinations.find()])), 200


@destinations_bp.route('/api/admin/destinations', methods=['POST'])
@jwt_required()
def admin_create_destination():
    db = require_db()
    data = clean(request.get_json(silent=True), DESTINATION_SCHEMA, partial=True)
    if not data.get('name'):
        raise ApiError("A name is required.")
    data.setdefault('isActive', True)
    data['id'] = 'dest-' + slugify(data['name'])
    if db.destinations.find_one({"$or": [{"id": data['id']}, {"name": data['name']}]}):
        raise ApiError("A destination with this name already exists.", 409)
    db.destinations.insert_one(data)
    return jsonify(public(data)), 201


def _find_query(db, destination_id):
    """Older destinations were stored without an id; match those by their derived slug."""
    if db.destinations.find_one({"id": destination_id}):
        return {"id": destination_id}
    for d in db.destinations.find({"id": {"$exists": False}}):
        if 'dest-' + slugify(d.get('name', '')) == destination_id:
            return {"_id": d['_id']}
    raise ApiError("Destination not found.", 404)


@destinations_bp.route('/api/admin/destinations/<destination_id>', methods=['PUT'])
@jwt_required()
def admin_update_destination(destination_id):
    db = require_db()
    query = _find_query(db, destination_id)
    data = clean(request.get_json(silent=True), DESTINATION_SCHEMA, partial=True)
    data['id'] = destination_id
    db.destinations.update_one(query, {"$set": data})
    return jsonify(_ensure_id(db.destinations.find_one({"id": destination_id}))), 200


@destinations_bp.route('/api/admin/destinations/<destination_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_destination(destination_id):
    db = require_db()
    db.destinations.delete_one(_find_query(db, destination_id))
    return jsonify({"message": "Destination deleted."}), 200
