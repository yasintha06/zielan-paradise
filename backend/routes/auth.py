"""
Zeilan Paradise — Auth Routes (JWT Protected)
POST /api/admin/login — Authenticate admin and return JWT token.
"""
import time
from collections import defaultdict, deque

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from config import Config
import bcrypt

auth_bp = Blueprint('auth', __name__)

# In production, store the hashed password in the database.
# For now, we hash the default password from .env at startup.
_admin_password_hash = bcrypt.hashpw(
    Config.ADMIN_PASSWORD.encode('utf-8'),
    bcrypt.gensalt()
)


# Simple brute-force protection: at most MAX_FAILURES failed logins per client per window.
MAX_FAILURES = 5
WINDOW_SECONDS = 15 * 60
_failures = defaultdict(deque)


def _client_ip():
    # Azure's front end appends the real client address last in X-Forwarded-For; earlier
    # entries can be supplied by the client, so they can't be trusted. It may include a port.
    forwarded = request.headers.get('X-Forwarded-For', '')
    ip = forwarded.split(',')[-1].strip() if forwarded else (request.remote_addr or 'unknown')
    return ip.rsplit(':', 1)[0] if ip.count(':') == 1 else ip


def _recent_failures(ip):
    attempts = _failures[ip]
    cutoff = time.time() - WINDOW_SECONDS
    while attempts and attempts[0] < cutoff:
        attempts.popleft()
    return attempts


@auth_bp.route('/api/admin/login', methods=['POST'])
def admin_login():
    """
    Authenticate an admin user.
    Expects JSON: { "username": "admin", "password": "..." }
    Returns: { "access_token": "...", "message": "Login successful" }
    """
    data = request.get_json()

    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "Username and password are required."}), 400

    ip = _client_ip()
    attempts = _recent_failures(ip)
    if len(attempts) >= MAX_FAILURES:
        return jsonify({"error": "Too many failed attempts. Please wait 15 minutes and try again."}), 429

    username = str(data.get('username', '')).strip()
    password = str(data.get('password', ''))

    valid = bcrypt.checkpw(password.encode('utf-8'), _admin_password_hash)
    if username != Config.ADMIN_USERNAME or not valid:
        attempts.append(time.time())
        return jsonify({"error": "Invalid credentials."}), 401

    attempts.clear()

    # Create JWT token
    access_token = create_access_token(identity=username)

    return jsonify({
        "access_token": access_token,
        "message": "Login successful.",
        "admin": username
    }), 200


@auth_bp.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    """
    Logout admin user endpoint.
    Returns: { "message": "Logout successful." }
    """
    return jsonify({"message": "Logout successful."}), 200

