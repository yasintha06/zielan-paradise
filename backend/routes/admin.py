"""
Zeilan Paradise — Admin tools
GET  /api/admin/overview          — counts for the dashboard home
POST /api/admin/catalog/import    — add catalogue tours/destinations missing from the database
GET  /api/admin/images            — photos available in the site's image library
Quotes (costing calculator):
GET/POST /api/admin/quotes · GET/PUT/DELETE /api/admin/quotes/<id>
"""
import os

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from api_utils import ApiError, clean, id_query, new_id, now_iso, public, require_db, slugify
from catalog_data import CATALOG_DESTINATIONS, CATALOG_TOURS

admin_bp = Blueprint('admin', __name__)

IMAGE_DIRS = [
    os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'static', 'img'),
    os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'frontend', 'public', 'img'),
]

QUOTE_SCHEMA = {'title': 'str', 'clientName': 'str', 'status': 'str', 'data': 'json'}


@admin_bp.route('/api/admin/overview', methods=['GET'])
@jwt_required()
def overview():
    db = require_db()
    statuses = {}
    for doc in db.inquiries.find({}, {"status": 1}):
        s = doc.get('status') or 'New'
        s = 'New' if s == 'New Lead' else s
        statuses[s] = statuses.get(s, 0) + 1
    return jsonify({
        "enquiries": sum(statuses.values()),
        "enquiriesByStatus": statuses,
        "tours": db.tours.count_documents({}),
        "activeTours": db.tours.count_documents({"isActive": {"$ne": False}}),
        "destinations": db.destinations.count_documents({}),
        "reviews": db.testimonials.count_documents({}),
        "quotes": db.quotes.count_documents({}),
    }), 200


@admin_bp.route('/api/admin/catalog/import', methods=['POST'])
@jwt_required()
def import_catalog():
    """Adds catalogue entries whose id isn't in the database. Never overwrites your edits."""
    db = require_db()
    tour_ids = {t.get('id') for t in db.tours.find({}, {"id": 1})}
    new_tours = [dict(t) for t in CATALOG_TOURS if t['id'] not in tour_ids]
    if new_tours:
        db.tours.insert_many(new_tours)

    dest_keys = set()
    for d in db.destinations.find({}, {"id": 1, "name": 1}):
        dest_keys.add(d.get('id') or 'dest-' + slugify(d.get('name', '')))
    new_dests = [dict(d) for d in CATALOG_DESTINATIONS if d['id'] not in dest_keys]
    if new_dests:
        db.destinations.insert_many(new_dests)

    return jsonify({
        "addedTours": [t['title'] for t in new_tours],
        "addedDestinations": [d['name'] for d in new_dests],
    }), 200


@admin_bp.route('/api/admin/images', methods=['GET'])
@jwt_required()
def list_images():
    names = set()
    for folder in IMAGE_DIRS:
        if os.path.isdir(folder):
            for f in os.listdir(folder):
                if f.endswith('-900.webp'):
                    names.add(f[:-len('-900.webp')])
    return jsonify(sorted(names)), 200


# ── Quotes ───────────────────────────────────────────────────
@admin_bp.route('/api/admin/quotes', methods=['GET'])
@jwt_required()
def list_quotes():
    db = require_db()
    quotes = [public(q) for q in db.quotes.find({}, {"data": 0}).sort("updatedAt", -1)]
    return jsonify(quotes), 200


@admin_bp.route('/api/admin/quotes/<quote_id>', methods=['GET'])
@jwt_required()
def get_quote(quote_id):
    db = require_db()
    quote = public(db.quotes.find_one(id_query(quote_id)))
    if not quote:
        raise ApiError("Quote not found.", 404)
    return jsonify(quote), 200


@admin_bp.route('/api/admin/quotes', methods=['POST'])
@jwt_required()
def create_quote():
    db = require_db()
    data = clean(request.get_json(silent=True), QUOTE_SCHEMA, partial=True)
    if not data.get('title'):
        raise ApiError("Give the quote a name.")
    data.update(id=new_id('quote'), createdAt=now_iso(), updatedAt=now_iso())
    db.quotes.insert_one(data)
    return jsonify(public(data)), 201


@admin_bp.route('/api/admin/quotes/<quote_id>', methods=['PUT'])
@jwt_required()
def update_quote(quote_id):
    db = require_db()
    data = clean(request.get_json(silent=True), QUOTE_SCHEMA, partial=True)
    data['updatedAt'] = now_iso()
    if db.quotes.update_one(id_query(quote_id), {"$set": data}).matched_count == 0:
        raise ApiError("Quote not found.", 404)
    return jsonify(public(db.quotes.find_one(id_query(quote_id)))), 200


@admin_bp.route('/api/admin/quotes/<quote_id>', methods=['DELETE'])
@jwt_required()
def delete_quote(quote_id):
    db = require_db()
    if db.quotes.delete_one(id_query(quote_id)).deleted_count == 0:
        raise ApiError("Quote not found.", 404)
    return jsonify({"message": "Quote deleted."}), 200
