"""
Serves the built Angular website from the same App Service as the API.

The deploy workflow copies the Angular build into backend/static/. When that folder
exists, WhiteNoise serves its files (pre-compressed, with cache headers) and any other
non-API path falls back to index.html so the Angular router can handle it.
Locally, without a build, the API runs exactly as before.
"""
import html
import os
import re

from flask import Response, abort, redirect
from whitenoise import WhiteNoise

STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')

# Angular output files carry a content hash, e.g. main-IORFJ7TF.js, so they never change.
HASHED_FILE = re.compile(r'-[A-Za-z0-9_]{8}\.(js|css)$')

# Render's domain settings make www the main address (the plain domain redirects to it).
ORIGIN = 'https://www.zeilanparadise.com'
# Short addresses people are likely to type.
REDIRECTS = {'journeys': '/round-tours', 'terms': '/terms-and-conditions'}

SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'SAMEORIGIN',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}


def _file_headers(headers, path, url):
    for name, value in SECURITY_HEADERS.items():
        headers[name] = value
    if url.endswith('.html') or url == '/':
        headers['Cache-Control'] = 'no-cache'
    elif url.startswith(('/img/', '/images/', '/assets/', '/video/')):
        headers['Cache-Control'] = 'public, max-age=2592000'


def with_page_address(page, path):
    """Put this page's own address in the HTML, so search engines see it before any JavaScript runs."""
    url = html.escape(f"{ORIGIN}/{path}".rstrip('/'), quote=True)
    return (page
            .replace(f'<link rel="canonical" href="{ORIGIN}/">', f'<link rel="canonical" href="{url}">')
            .replace(f'<meta property="og:url" content="{ORIGIN}/">', f'<meta property="og:url" content="{url}">'))


# The www / non-www redirect is done by Render's custom-domain settings, not here: doing it in both
# places sent visitors round in a loop.


def attach_website(app):
    if not os.path.isfile(os.path.join(STATIC_DIR, 'index.html')):
        print("  [WEB] No website build found in backend/static; serving API only.")
        return False

    app.wsgi_app = WhiteNoise(
        app.wsgi_app,
        root=STATIC_DIR,
        index_file=True,
        max_age=3600,
        immutable_file_test=lambda path, url: bool(HASHED_FILE.search(url)),
        add_headers_function=_file_headers,
    )

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def spa_fallback(path):
        # Unknown API routes and missing files (anything with an extension) are real 404s.
        if path.startswith('api/') or os.path.splitext(path)[1]:
            abort(404)
        if path.rstrip('/') in REDIRECTS:
            return redirect(REDIRECTS[path.rstrip('/')], code=301)
        with open(os.path.join(STATIC_DIR, 'index.html'), encoding='utf8') as f:
            response = Response(with_page_address(f.read(), path), mimetype='text/html')
        response.headers['Cache-Control'] = 'no-cache'
        for name, value in SECURITY_HEADERS.items():
            response.headers[name] = value
        return response

    print("  [WEB] Serving website from backend/static")
    return True
