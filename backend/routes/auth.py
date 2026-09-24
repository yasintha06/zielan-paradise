"""
Zeilan Paradise — Auth Routes (JWT Protected)
POST /api/admin/login — Authenticate admin and return JWT token.
"""
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

    username = data.get('username', '')
    password = data.get('password', '')

    if username != Config.ADMIN_USERNAME:
        return jsonify({"error": "Invalid credentials."}), 401

    if not bcrypt.checkpw(password.encode('utf-8'), _admin_password_hash):
        return jsonify({"error": "Invalid credentials."}), 401

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

