"""
Zeilan Paradise — Auth Routes (JWT Protected)
POST /api/admin/login — Authenticate admin and return JWT token.
"""
import hmac
import time
from collections import defaultdict, deque

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from api_utils import client_ip
from config import Config
import bcrypt

auth_bp = Blueprint('auth', __name__)

# In production, store the hashed password in the database.
# For now, we hash the default password from .env at startup.
_admin_password_hash = bcrypt.hashpw(
    Config.ADMIN_PASSWORD.encode('utf-8')[:72],
    bcrypt.gensalt()
)


# Simple brute-force protection: at most MAX_FAILURES failed logins per client per window.
MAX_FAILURES = 5
WINDOW_SECONDS = 15 * 60
_failures = defaultdict(deque)


# A second, site-wide cap: even an attacker using many addresses gets only a trickle of guesses.
MAX_FAILURES_ALL = 30
_all_failures = deque()


def _all_recent_failures():
    cutoff = time.time() - WINDOW_SECONDS
    while _all_failures and _all_failures[0] < cutoff:
        _all_failures.popleft()
    return _all_failures


def _recent_failures(ip):
    attempts = _failures[ip]
    cutoff = time.time() - WINDOW_SECONDS
    while attempts and attempts[0] < cutoff:
        attempts.popleft()
    # Forget clients with no recent failures so the table can't grow forever.
    for key in [k for k, v in _failures.items() if not v and k != ip]:
        del _failures[key]
    return attempts


@auth_bp.route('/api/admin/login', methods=['POST'])
def admin_login():
    """
    Authenticate an admin user.
    Expects JSON: { "username": "admin", "password": "..." }
    Returns: { "access_token": "...", "message": "Login successful" }
    """
    data = request.get_json(silent=True)

    if not isinstance(data, dict) or 'username' not in data or 'password' not in data:
        return jsonify({"error": "Username and password are required."}), 400

    ip = client_ip()
    attempts = _recent_failures(ip)
    if len(attempts) >= MAX_FAILURES or len(_all_recent_failures()) >= MAX_FAILURES_ALL:
        return jsonify({"error": "Too many failed attempts. Please wait 15 minutes and try again."}), 429

    username = str(data.get('username', '')).strip()
    password = str(data.get('password', ''))

    valid = bcrypt.checkpw(password.encode('utf-8')[:72], _admin_password_hash)
    same_user = hmac.compare_digest(username.encode('utf-8'), Config.ADMIN_USERNAME.encode('utf-8'))
    if not same_user or not valid:
        attempts.append(time.time())
        _all_failures.append(time.time())
        print(f"[AUTH] Failed admin login from {ip} ({len(attempts)} recent)", flush=True)
        return jsonify({"error": "Invalid credentials."}), 401

    attempts.clear()

    print(f"[AUTH] Admin login from {ip}", flush=True)
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

