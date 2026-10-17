import os
import secrets
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# Azure App Service always sets WEBSITE_SITE_NAME, so a deployed site is treated as production
# even if FLASK_ENV was forgotten.
_ON_AZURE = bool(os.getenv('WEBSITE_SITE_NAME'))
_DEFAULT_JWT_SECRET = 'change-this-in-production'
_DEFAULT_ADMIN_PASSWORD = 'change-me'


class Config:
    """Centralized configuration for the Flask application."""
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/zeilanparadise')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', _DEFAULT_JWT_SECRET)
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours in seconds
    FLASK_ENV = os.getenv('FLASK_ENV', 'production' if _ON_AZURE else 'development')
    FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
    ADMIN_USERNAME = os.getenv('ADMIN_USERNAME', 'admin')
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', _DEFAULT_ADMIN_PASSWORD)
    # Comma-separated list of sites allowed to call the API from a browser.
    ALLOWED_ORIGINS = [o.strip() for o in os.getenv(
        'ALLOWED_ORIGINS',
        'https://zeilanparadise.com,https://www.zeilanparadise.com' if FLASK_ENV == 'production' else '*'
    ).split(',') if o.strip()]


if Config.FLASK_ENV == 'production':
    _missing = [k for k in ('MONGO_URI', 'JWT_SECRET_KEY', 'ADMIN_PASSWORD') if not os.getenv(k)]
    if _missing and not _ON_AZURE:
        raise RuntimeError(f"Missing required production settings: {', '.join(_missing)}")
    if _missing:
        # On Azure, keep the public site up but never accept the publicly known defaults:
        # a random signing key (admin sessions reset on restart) and no admin login until a password is set.
        print(f"  [WARN] Missing App Service settings: {', '.join(_missing)}. Set them in Azure.")
        if Config.JWT_SECRET_KEY == _DEFAULT_JWT_SECRET:
            Config.JWT_SECRET_KEY = secrets.token_urlsafe(48)
        if Config.ADMIN_PASSWORD == _DEFAULT_ADMIN_PASSWORD:
            Config.ADMIN_PASSWORD = secrets.token_urlsafe(32)
