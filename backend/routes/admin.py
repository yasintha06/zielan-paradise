"""
Zeilan Paradise — Admin tools
GET  /api/admin/overview          — counts for the dashboard home
POST /api/admin/catalog/import    — sync catalogue tours/destinations into the database (add, refresh, hide retired)
GET  /api/admin/images            — photos available in the site's image library
Quotes (costing calculator):
GET/POST /api/admin/quotes · GET/PUT/DELETE /api/admin/quotes/<id>
"""
import os

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from api_utils import ApiError, clean, id_query, new_id, now_iso, public, require_db, slugify
from catalog_data import CATALOG_DESTINATIONS, CATALOG_TOURS, RETIRED_DESTINATION_IDS, RETIRED_TOUR_IDS

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
    """
    Brings the database in line with the built-in catalogue:
      - adds catalogue entries whose id isn't in the database;
      - replaces copies saved from an older catalogue revision (catalogRev), so rewritten tours show
        their new content; items already on the current revision, including your admin edits, are left alone;
      - hides (isActive=false, never deletes) the retired items listed in data/retired.json.
    """
    db = require_db()
    report = {"addedTours": [], "updatedTours": [], "hiddenTours": [],
              "addedDestinations": [], "updatedDestinations": [], "hiddenDestinations": []}

    def sync(collection, catalogue, retired, key, kind):
        existing = {key(doc): doc for doc in collection.find()}
        for item in catalogue:
            doc = existing.get(item['id'])
            if doc is None:
                collection.insert_one(dict(item))
                report['added' + kind].append(item.get('title') or item.get('name'))
            elif (doc.get('catalogRev') or 0) < item.get('catalogRev', 0):
                collection.replace_one({"_id": doc['_id']}, dict(item))
                report['updated' + kind].append(item.get('title') or item.get('name'))
        for doc_key, doc in existing.items():
            if doc_key in retired and doc.get('isActive') is not False:
                collection.update_one({"_id": doc['_id']}, {"$set": {"isActive": False}})
                report['hidden' + kind].append(doc.get('title') or doc.get('name'))

    sync(db.tours, CATALOG_TOURS, set(RETIRED_TOUR_IDS), lambda d: d.get('id'), 'Tours')
    sync(db.destinations, CATALOG_DESTINATIONS, set(RETIRED_DESTINATION_IDS),
         lambda d: d.get('id') or 'dest-' + slugify(d.get('name', '')), 'Destinations')
    return jsonify(report), 200


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
