"""
API tests against an in-memory MongoDB (mongomock); the real database is never touched.
Run:  cd backend && venv/Scripts/python -m pytest -q
"""
import os
import sys

import mongomock
import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('MONGO_URI', 'mongodb://unused')

import app as app_module  # noqa: E402
import db as db_module  # noqa: E402
from config import Config  # noqa: E402

PASSWORD = Config.ADMIN_PASSWORD


@pytest.fixture()
def client(monkeypatch):
    def fake_init_db():
        db_module.db = mongomock.MongoClient().get_database('zeilanparadise')
        db_module._seed_initial_data()

    monkeypatch.setattr(app_module, 'init_db', fake_init_db)
    flask_app = app_module.create_app()
    flask_app.config['TESTING'] = True
    from routes import auth
    auth._failures.clear()
    return flask_app.test_client()


@pytest.fixture()
def auth_headers(client):
    res = client.post('/api/admin/login', json={'username': Config.ADMIN_USERNAME, 'password': PASSWORD})
    assert res.status_code == 200, res.get_json()
    return {'Authorization': f"Bearer {res.get_json()['access_token']}"}


# ── Public ───────────────────────────────────────────────────
def test_health_reports_database(client):
    body = client.get('/api/health').get_json()
    assert body['status'] == 'healthy' and body['database'] == 'connected'


def test_tours_are_seeded_and_filterable(client):
    rounds = client.get('/api/tours?type=round').get_json()
    days = client.get('/api/tours?type=day').get_json()
    assert len(rounds) == 10 and all(t['type'] == 'round' for t in rounds)
    assert len(days) == 9
    assert all('_id' not in t for t in rounds)


def test_single_tour_and_missing_tour(client):
    assert client.get('/api/tours/tour-east-coast-summer').status_code == 200
    assert client.get('/api/tours/nope').status_code == 404


def test_unknown_api_route_returns_json_404(client):
    res = client.get('/api/does-not-exist')
    assert res.status_code == 404 and res.get_json()['error']


def test_reviews_only_show_published(client, auth_headers):
    client.post('/api/admin/testimonials', headers=auth_headers,
                json={'authorName': 'A', 'text': 'Great', 'published': True})
    client.post('/api/admin/testimonials', headers=auth_headers,
                json={'authorName': 'B', 'text': 'Draft', 'published': False})
    public = client.get('/api/testimonials').get_json()
    assert [r['authorName'] for r in public] == ['A']


# ── Security ─────────────────────────────────────────────────
@pytest.mark.parametrize('method,url', [
    ('post', '/api/admin/tours'), ('put', '/api/admin/tours/x'), ('delete', '/api/admin/tours/x'),
    ('get', '/api/admin/inquiries'), ('patch', '/api/admin/inquiries/x'), ('delete', '/api/admin/inquiries/x'),
    ('post', '/api/admin/destinations'), ('post', '/api/admin/testimonials'),
    ('get', '/api/admin/quotes'), ('post', '/api/admin/catalog/import'), ('get', '/api/admin/overview'),
])
def test_admin_routes_require_login(client, method, url):
    assert getattr(client, method)(url, json={}).status_code == 401


def test_old_unprotected_tour_routes_are_gone(client):
    assert client.post('/api/tours', json={'title': 'x'}).status_code in (404, 405)
    assert client.delete('/api/tours/tour-grand-island-odyssey').status_code in (404, 405)


def test_login_locks_after_repeated_failures(client):
    for _ in range(5):
        assert client.post('/api/admin/login', json={'username': 'admin', 'password': 'bad'}).status_code == 401
    res = client.post('/api/admin/login', json={'username': Config.ADMIN_USERNAME, 'password': PASSWORD})
    assert res.status_code == 429


# ── Enquiries ────────────────────────────────────────────────
def test_contact_enquiry_is_normalised_and_unknown_fields_dropped(client, auth_headers):
    res = client.post('/api/enquiries', json={
        'type': 'contact', 'firstName': 'Jane', 'lastName': 'Doe', 'email': 'jane@example.com',
        'message': 'Hello', 'status': 'Booked', 'evil': {'$set': 1},
    })
    assert res.status_code == 201
    leads = client.get('/api/admin/inquiries', headers=auth_headers).get_json()
    assert len(leads) == 1
    lead = leads[0]
    assert lead['kind'] == 'contact' and lead['status'] == 'New' and lead['email'] == 'jane@example.com'
    assert 'evil' not in lead


def test_planner_enquiry_shape(client, auth_headers):
    client.post('/api/inquiries', json={
        'clientName': {'firstName': 'Sam', 'lastName': 'Lee'}, 'contact': {'email': 'sam@example.com', 'phone': '+44 7'},
        'tripDetails': {'estimatedMonth': 'March 2027', 'durationDays': 12, 'travelers': {'adults': 2, 'children': 1},
                        'accommodationStyle': 'Luxury'},
        'preferences': {'interests': ['Wildlife & Safaris'], 'regions': [], 'pace': 'Balanced'},
        'planningStage': 'Ready to book', 'additionalNotes': 'Anniversary',
    })
    lead = client.get('/api/admin/inquiries', headers=auth_headers).get_json()[0]
    assert lead['kind'] == 'planner' and lead['trip']['days'] == 12 and lead['trip']['children'] == 1
    assert lead['message'] == 'Anniversary'


@pytest.mark.parametrize('payload', [{}, {'firstName': 'A'}, {'firstName': 'A', 'email': 'not-an-email'}])
def test_enquiry_validation(client, payload):
    assert client.post('/api/enquiries', json=payload).status_code == 400


def test_honeypot_is_silently_dropped(client, auth_headers):
    res = client.post('/api/enquiries', json={'firstName': 'Bot', 'email': 'b@b.co', 'website': 'spam.com'})
    assert res.status_code == 201
    assert client.get('/api/admin/inquiries', headers=auth_headers).get_json() == []


def test_enquiry_status_notes_and_delete(client, auth_headers):
    client.post('/api/enquiries', json={'firstName': 'Jo', 'email': 'jo@example.com', 'message': 'Hi'})
    lead_id = client.get('/api/admin/inquiries', headers=auth_headers).get_json()[0]['id']
    res = client.patch(f'/api/admin/inquiries/{lead_id}', headers=auth_headers,
                       json={'status': 'Contacted', 'notes': 'Called, sending proposal'})
    assert res.status_code == 200 and res.get_json()['status'] == 'Contacted'
    assert client.patch(f'/api/admin/inquiries/{lead_id}', headers=auth_headers,
                        json={'status': 'Whatever'}).status_code == 400
    assert client.delete(f'/api/admin/inquiries/{lead_id}', headers=auth_headers).status_code == 200
    assert client.get('/api/admin/inquiries', headers=auth_headers).get_json() == []


def test_legacy_enquiry_without_id_can_be_updated(client, auth_headers):
    db_module.db.inquiries.insert_one({'firstName': 'Old', 'email': 'old@example.com', 'status': 'New Lead'})
    lead = client.get('/api/admin/inquiries', headers=auth_headers).get_json()[0]
    assert lead['status'] == 'New' and lead['id']
    res = client.patch(f"/api/admin/inquiries/{lead['id']}", headers=auth_headers, json={'status': 'Closed'})
    assert res.status_code == 200


# ── Tours, destinations, quotes ──────────────────────────────
def test_tour_crud_and_hidden_tours(client, auth_headers):
    res = client.post('/api/admin/tours', headers=auth_headers, json={
        'title': 'Test Journey', 'type': 'round', 'duration': '5 Days', 'highlights': ['A', 'B'],
        'itinerary': [{'day': 'Day 1', 'title': 'Start', 'description': 'Go', 'junk': 'x'}], 'hacker': True,
    })
    assert res.status_code == 201
    tour = res.get_json()
    assert tour['id'] == 'tour-test-journey' and 'hacker' not in tour and 'junk' not in tour['itinerary'][0]

    client.put(f"/api/admin/tours/{tour['id']}", headers=auth_headers, json={'isActive': False})
    assert client.get(f"/api/tours/{tour['id']}").status_code == 404  # hidden from the public site
    admin_ids = [t['id'] for t in client.get('/api/admin/tours', headers=auth_headers).get_json()]
    assert tour['id'] in admin_ids

    assert client.delete(f"/api/admin/tours/{tour['id']}", headers=auth_headers).status_code == 200
    assert client.post('/api/admin/tours', headers=auth_headers, json={'title': ''}).status_code == 400


def test_catalog_import_only_adds_missing(client, auth_headers):
    client.delete('/api/admin/tours/tour-east-coast-summer', headers=auth_headers)
    client.put('/api/admin/tours/tour-grand-island-odyssey', headers=auth_headers, json={'title': 'My Edited Title'})
    res = client.post('/api/admin/catalog/import', headers=auth_headers).get_json()
    assert res['addedTours'] == ['East Coast Summer Escape']
    assert client.get('/api/tours/tour-grand-island-odyssey').get_json()['title'] == 'My Edited Title'


def test_destination_crud_including_legacy_without_id(client, auth_headers):
    db_module.db.destinations.insert_one({'name': 'Legacy Place', 'tagline': 't'})
    assert client.put('/api/admin/destinations/dest-legacy-place', headers=auth_headers,
                      json={'tagline': 'Updated'}).status_code == 200
    assert client.get('/api/destinations/dest-legacy-place').get_json()['tagline'] == 'Updated'
    assert client.delete('/api/admin/destinations/dest-legacy-place', headers=auth_headers).status_code == 200


def test_quotes_crud(client, auth_headers):
    res = client.post('/api/admin/quotes', headers=auth_headers,
                      json={'title': 'Smith family', 'data': {'pax': 4, 'markup': 20}})
    quote_id = res.get_json()['id']
    assert client.get(f'/api/admin/quotes/{quote_id}', headers=auth_headers).get_json()['data']['pax'] == 4
    client.put(f'/api/admin/quotes/{quote_id}', headers=auth_headers, json={'title': 'Smith family v2'})
    titles = [q['title'] for q in client.get('/api/admin/quotes', headers=auth_headers).get_json()]
    assert titles == ['Smith family v2']
    assert client.delete(f'/api/admin/quotes/{quote_id}', headers=auth_headers).status_code == 200


def test_overview_counts(client, auth_headers):
    client.post('/api/enquiries', json={'firstName': 'Jo', 'email': 'jo@example.com'})
    body = client.get('/api/admin/overview', headers=auth_headers).get_json()
    assert body['enquiries'] == 1 and body['enquiriesByStatus'] == {'New': 1} and body['tours'] == 19
