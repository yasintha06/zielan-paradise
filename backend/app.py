"""
═══════════════════════════════════════════════════════════════
  ZEILAN PARADISE — Flask REST API
  Premium DMC Backend for Sri Lanka Luxury Travel
  Port: 5000
═══════════════════════════════════════════════════════════════
"""
from datetime import timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from db import get_db, init_db
from website import attach_website
from api_utils import register_error_handler
from routes import auth_bp, tours_bp, destinations_bp, testimonials_bp, enquiries_bp, admin_bp


def create_app():
    """Application factory pattern."""
    # static_folder=None: the website build is served by website.py, not Flask's /static route.
    app = Flask(__name__, static_folder=None)

    # ── Configuration ──────────────────────────────────────
    app.config['JWT_SECRET_KEY'] = Config.JWT_SECRET_KEY
    app.config['MAX_CONTENT_LENGTH'] = 64 * 1024  # enquiries are small; reject oversized payloads
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(seconds=Config.JWT_ACCESS_TOKEN_EXPIRES)

    # ── Extensions ─────────────────────────────────────────
    CORS(app, origins=Config.ALLOWED_ORIGINS)
    JWTManager(app)

    # ── Database ───────────────────────────────────────────
    print("\n[Zeilan Paradise API] Starting...")
    init_db()

    # ── Register Blueprints ────────────────────────────────
    app.register_blueprint(auth_bp)
    app.register_blueprint(tours_bp)
    app.register_blueprint(destinations_bp)
    app.register_blueprint(testimonials_bp)
    app.register_blueprint(enquiries_bp)
    app.register_blueprint(admin_bp)
    register_error_handler(app)

    @app.errorhandler(404)
    def not_found(_err):
        if request.path.startswith('/api/'):
            return jsonify({"error": "Not found."}), 404
        return _err

    @app.errorhandler(405)
    def method_not_allowed(_err):
        return jsonify({"error": "Method not allowed."}), 405

    # ── Health Check ───────────────────────────────────────
    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({
            "status": "healthy",
            "database": "connected" if get_db() is not None else "unavailable",
            "service": "Zeilan Paradise API",
            "version": "1.0.0"
        }), 200

    # ── Website (when a build is present) or API root ─────
    if attach_website(app):
        return app

    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            "message": "Welcome to the Zeilan Paradise API",
            "documentation": {
                "GET /api/health": "Health check",
                "GET /api/tours": "List tours (?type=round&market=uk&featured=true)",
                "GET /api/destinations": "List destinations (?featured=true)",
                "GET /api/testimonials": "List testimonials (?market=uk)",
                "POST /api/admin/login": "Admin authentication (returns JWT)",
                "POST /api/tours": "Create tour (JWT required)",
                "POST /api/destinations": "Create destination (JWT required)",
                "POST /api/testimonials": "Create testimonial (JWT required)",
                "POST /api/enquiries": "Submit an enquiry (Public)"
            }
        }), 200

    print(f"  [OK] API ready on port {Config.FLASK_PORT}")
    print(f"  [URL] http://localhost:{Config.FLASK_PORT}/api/health\n")

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(
        host='0.0.0.0',
        port=Config.FLASK_PORT,
        debug=(Config.FLASK_ENV == 'development'),
        threaded=True
    )
