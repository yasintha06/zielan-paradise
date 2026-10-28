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
    assert len(days) == 8
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
    assert client.delete('/api/tours/tour-grand-explorer').status_code in (404, 405)


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


def test_catalog_import_adds_missing_and_keeps_current_edits(client, auth_headers):
    client.delete('/api/admin/tours/tour-east-coast-summer', headers=auth_headers)
    client.put('/api/admin/tours/tour-grand-explorer', headers=auth_headers, json={'title': 'My Edited Title'})
    res = client.post('/api/admin/catalog/import', headers=auth_headers).get_json()
    assert res['addedTours'] == ['East Coast Summer Escape']
    assert client.get('/api/tours/tour-grand-explorer').get_json()['title'] == 'My Edited Title'


def test_catalog_import_refreshes_old_copies_and_hides_retired(client, auth_headers):
    db = db_module.db
    # The live database as it was before the October 2026 rewrite: old content, no catalogRev.
    db.tours.update_one({'id': 'tour-ayurveda-wellness'}, {'$set': {'title': 'Old title'}, '$unset': {'catalogRev': ''}})
    db.tours.insert_one({'id': 'tour-grand-island-odyssey', 'title': 'The Grand Island Odyssey', 'type': 'round'})
    db.tours.insert_one({'id': 'tour-my-own', 'title': 'Added in the admin', 'type': 'round'})
    db.destinations.insert_one({'name': 'Galle Fort', 'tagline': 'old'})
    res = client.post('/api/admin/catalog/import', headers=auth_headers).get_json()
    assert res['updatedTours'] == ['Ayurveda & Wellness Retreat']
    assert res['hiddenTours'] == ['The Grand Island Odyssey'] and res['hiddenDestinations'] == ['Galle Fort']
    assert client.get('/api/tours/tour-grand-island-odyssey').status_code == 404
    assert db.tours.count_documents({'id': 'tour-grand-island-odyssey'}) == 1  # hidden, not deleted
    assert client.get('/api/tours/tour-my-own').status_code == 200
    assert client.get('/api/tours/tour-ayurveda-wellness').get_json()['title'] == 'Ayurveda & Wellness Retreat'
    again = client.post('/api/admin/catalog/import', headers=auth_headers).get_json()
    assert not any(again.values())


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
    assert body['enquiries'] == 1 and body['enquiriesByStatus'] == {'New': 1} and body['tours'] == 18


def test_login_rejects_non_object_json(client):
    assert client.post('/api/admin/login', json=['username', 'password']).status_code == 400
    res = client.post('/api/admin/login', data='not json', content_type='text/plain')
    assert res.status_code == 400 and res.get_json()['error']


def test_enquiry_names_are_single_line(client, auth_headers):
    client.post('/api/enquiries', json={'firstName': 'Bob\r\nBcc: x@y.z', 'email': 'bob@example.com', 'message': 'Hi'})
    lead = client.get('/api/admin/inquiries', headers=auth_headers).get_json()[0]
    assert '\n' not in lead['firstName'] and '\r' not in lead['firstName']


def test_email_settings_accept_smtp_password(monkeypatch):
    from routes import enquiries
    for k in ('SMTP_PASS', 'MAIL_PASSWORD', 'MAIL_USERNAME', 'ADMIN_EMAIL'):
        monkeypatch.delenv(k, raising=False)
    monkeypatch.setenv('SMTP_USER', 'info@example.com')
    monkeypatch.setenv('SMTP_PASSWORD', 'secret')
    monkeypatch.setenv('ADMIN_NOTIFICATION_EMAIL', 'info@example.com')
    assert enquiries.email_configured()


# ── Enquiry emails (nothing is really sent: the SMTP step is replaced) ───────────
@pytest.fixture()
def outbox(monkeypatch):
    """Runs the email step immediately and collects the messages instead of sending them."""
    from routes import enquiries
    sent = []

    class NowThread:
        def __init__(self, target, args=(), daemon=None):
            self.target, self.args = target, args

        def start(self):
            self.target(*self.args)

    for k in ('ADMIN_NOTIFICATION_EMAIL', 'ADMIN_EMAIL'):
        monkeypatch.delenv(k, raising=False)
    monkeypatch.setattr(enquiries.threading, 'Thread', NowThread)
    monkeypatch.setattr(enquiries, '_send', lambda messages: sent.extend(messages))
    enquiries._confirm_log.clear()
    return sent


def _text(msg):
    part = msg.get_payload()[0] if msg.is_multipart() else msg
    return part.get_payload(decode=True).decode('utf8')


def test_contact_enquiry_emails_the_business_only(client, outbox):
    res = client.post('/api/enquiries', json={'type': 'contact', 'firstName': 'Jane', 'lastName': 'Doe',
                                              'email': 'jane@example.com', 'message': 'Two weeks in March'})
    assert res.status_code == 201
    assert len(outbox) == 1
    msg = outbox[0]
    assert msg['To'] == 'info@zeilanparadise.com' and msg['Reply-To'] == 'jane@example.com'
    assert msg['Subject'] == 'Enquiry: Jane Doe' and 'Two weeks in March' in _text(msg)


def test_agent_enquiry_is_saved_and_confirmed(client, auth_headers, outbox):
    res = client.post('/api/enquiries', json={
        'type': 'agent', 'firstName': 'Sam Agent', 'company': 'Example Travel Ltd', 'email': 'sam@agency.example',
        'phone': '+44 20 0000 0000', 'message': 'Classic Ceylon & Coast, 4 guests, February'})
    assert res.status_code == 201
    lead = client.get('/api/admin/inquiries', headers=auth_headers).get_json()[0]
    assert lead['kind'] == 'agent' and lead['company'] == 'Example Travel Ltd'

    notification, confirmation = outbox
    assert notification['To'] == 'info@zeilanparadise.com'
    assert notification['Subject'] == 'Agent enquiry: Sam Agent (Example Travel Ltd)'
    assert 'Example Travel Ltd' in _text(notification) and 'Travel agent form' in _text(notification)
    assert confirmation['To'] == 'sam@agency.example' and confirmation['Reply-To'] == 'info@zeilanparadise.com'
    assert confirmation.get_content_type() == 'text/plain'
    body = _text(confirmation)
    assert body.startswith('Dear Sam Agent,') and 'Classic Ceylon' not in body  # never echoes the message


def test_agent_enquiry_needs_a_company(client, outbox):
    res = client.post('/api/enquiries', json={'type': 'agent', 'firstName': 'Sam', 'email': 'sam@agency.example'})
    assert res.status_code == 400 and outbox == []


def test_agent_honeypot_sends_nothing(client, auth_headers, outbox):
    res = client.post('/api/enquiries', json={'type': 'agent', 'firstName': 'Bot', 'company': 'X',
                                              'email': 'victim@example.com', 'website': 'spam.com'})
    assert res.status_code == 201 and outbox == []
    assert client.get('/api/admin/inquiries', headers=auth_headers).get_json() == []


def test_agent_confirmations_are_capped(client, outbox):
    for _ in range(5):
        client.post('/api/enquiries', json={'type': 'agent', 'firstName': 'Sam', 'company': 'X',
                                            'email': 'same@agency.example'})
    confirmations = [m for m in outbox if m['To'] == 'same@agency.example']
    assert len(confirmations) == 3 and len(outbox) == 8  # every enquiry still reaches the business
