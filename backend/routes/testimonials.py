"""
Zeilan Paradise — Guest reviews (testimonials)
Public:  GET /api/testimonials           (published reviews only)
Admin:   GET/POST /api/admin/testimonials · PUT/DELETE /api/admin/testimonials/<id>
Only genuine reviews belong here; nothing is seeded.
"""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from api_utils import ApiError, clean, id_query, new_id, now_iso, public, require_db
from db import get_db

testimonials_bp = Blueprint('testimonials', __name__)

REVIEW_SCHEMA = {
    'authorName': 'str', 'authorLocation': 'str', 'text': 'text', 'rating': 'int',
    'tripName': 'str', 'travelDate': 'str', 'source': 'str', 'published': 'bool',
}


def _validate(data, partial):
    if not partial or 'text' in data:
        if not data.get('text'):
            raise ApiError("The review text is required.")
    if not partial or 'authorName' in data:
        if not data.get('authorName'):
            raise ApiError("The guest's name is required.")
    if data.get('rating') is not None and not 1 <= data['rating'] <= 5:
        raise ApiError("Rating must be between 1 and 5.")


@testimonials_bp.route('/api/testimonials', methods=['GET'])
def list_reviews():
    db = get_db()
    if db is None:
        return jsonify([]), 200
    reviews = [public(r) for r in db.testimonials.find({"published": True}).sort("createdAt", -1)]
    return jsonify(reviews), 200


@testimonials_bp.route('/api/admin/testimonials', methods=['GET'])
@jwt_required()
def admin_list_reviews():
    db = require_db()
    return jsonify([public(r) for r in db.testimonials.find().sort("createdAt", -1)]), 200


@testimonials_bp.route('/api/admin/testimonials', methods=['POST'])
@jwt_required()
def admin_create_review():
    db = require_db()
    data = clean(request.get_json(silent=True), REVIEW_SCHEMA, partial=True)
    _validate(data, partial=False)
    data.update(id=new_id('review'), createdAt=now_iso())
    data.setdefault('published', True)
    data.setdefault('rating', 5)
    db.testimonials.insert_one(data)
    return jsonify(public(data)), 201


@testimonials_bp.route('/api/admin/testimonials/<review_id>', methods=['PUT'])
@jwt_required()
def admin_update_review(review_id):
    db = require_db()
    data = clean(request.get_json(silent=True), REVIEW_SCHEMA, partial=True)
    _validate(data, partial=True)
    if db.testimonials.update_one(id_query(review_id), {"$set": data}).matched_count == 0:
        raise ApiError("Review not found.", 404)
    return jsonify(public(db.testimonials.find_one(id_query(review_id)))), 200


@testimonials_bp.route('/api/admin/testimonials/<review_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_review(review_id):
    db = require_db()
    if db.testimonials.delete_one(id_query(review_id)).deleted_count == 0:
        raise ApiError("Review not found.", 404)
    return jsonify({"message": "Review deleted."}), 200
