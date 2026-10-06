"""Shared helpers for the API routes: database access, id handling and input cleaning."""
import re
import uuid
from datetime import datetime, timezone

from bson import ObjectId
from flask import jsonify

from db import get_db


class ApiError(Exception):
    def __init__(self, message, status=400):
        super().__init__(message)
        self.message = message
        self.status = status


def register_error_handler(app):
    @app.errorhandler(ApiError)
    def _handle(err):
        return jsonify({"error": err.message}), err.status


def require_db():
    db = get_db()
    if db is None:
        raise ApiError("The database is not available right now. Please try again shortly.", 503)
    return db


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def new_id(prefix):
    return f"{prefix}-{uuid.uuid4().hex[:12]}"


def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', str(text).lower()).strip('-')[:80]


def id_query(doc_id):
    """Match a document by our string id, falling back to Mongo's ObjectId for older records."""
    clauses = [{"id": doc_id}]
    if ObjectId.is_valid(doc_id):
        clauses.append({"_id": ObjectId(doc_id)})
    return {"$or": clauses}


def public(doc):
    """Strip Mongo's internal _id, keeping a string id for every document."""
    if doc is None:
        return None
    doc = dict(doc)
    oid = doc.pop('_id', None)
    if not doc.get('id') and oid is not None:
        doc['id'] = str(oid)
    return doc


# ── Input cleaning ───────────────────────────────────────────
# A schema maps field name -> kind. Unknown fields are dropped, so clients can't write arbitrary data.

def _text(value, limit):
    return str(value if value is not None else '').strip()[:limit]


def clean(data, schema, partial=False):
    if not isinstance(data, dict):
        raise ApiError("A JSON object is required.")
    out = {}
    for field, kind in schema.items():
        if field not in data:
            continue
        value = data[field]
        if kind == 'str':
            out[field] = _text(value, 300)
        elif kind == 'text':
            out[field] = _text(value, 5000)
        elif kind == 'bool':
            out[field] = bool(value)
        elif kind == 'int':
            try:
                out[field] = int(value)
            except (TypeError, ValueError):
                raise ApiError(f"'{field}' must be a whole number.")
        elif kind == 'number':
            try:
                out[field] = float(value)
            except (TypeError, ValueError):
                raise ApiError(f"'{field}' must be a number.")
        elif kind == 'strlist':
            items = value if isinstance(value, list) else str(value or '').split('\n')
            out[field] = [_text(v, 400) for v in items if str(v).strip()][:60]
        elif kind == 'badge':
            badge = value if isinstance(value, dict) else {"text": value}
            out[field] = {"text": _text(badge.get('text'), 60), "class": _text(badge.get('class'), 40)}
        elif kind == 'itinerary':
            days = value if isinstance(value, list) else []
            out[field] = [
                {k: _text(d.get(k), 2000 if k == 'description' else 200)
                 for k in ('day', 'title', 'location', 'description', 'drive', 'accommodation', 'meals') if d.get(k)}
                for d in days[:40] if isinstance(d, dict)
            ]
        elif kind == 'json':
            out[field] = value
    if not partial:
        for field in schema:
            out.setdefault(field, None)
    return out
