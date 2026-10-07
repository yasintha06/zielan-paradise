import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

class Config:
    """Centralized configuration for the Flask application."""
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/zeilanparadise')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'change-this-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours in seconds
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
    ADMIN_USERNAME = os.getenv('ADMIN_USERNAME', 'admin')
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'change-me')
    # Comma-separated list of sites allowed to call the API from a browser.
    ALLOWED_ORIGINS = [o.strip() for o in os.getenv(
        'ALLOWED_ORIGINS',
        'https://zeilanparadise.com,https://www.zeilanparadise.com' if FLASK_ENV == 'production' else '*'
    ).split(',') if o.strip()]


if Config.FLASK_ENV == 'production':
    _missing = [k for k in ('MONGO_URI', 'JWT_SECRET_KEY', 'ADMIN_PASSWORD') if not os.getenv(k)]
    if _missing:
        raise RuntimeError(f"Missing required production settings: {', '.join(_missing)}")
