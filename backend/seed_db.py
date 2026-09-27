r"""
═══════════════════════════════════════════════════════════════
  ZEILAN PARADISE — MongoDB Database Seeding Script
  Populates live MongoDB Atlas 'tours' and 'destinations' collections.
  Usage:
    cd d:\Zielan_Paradise\backend
    .\venv\Scripts\python.exe seed_db.py
═══════════════════════════════════════════════════════════════
"""
import os
import json
import re
from pymongo import MongoClient
from dotenv import load_dotenv

# ── Load environment variables ────────────────────────────────
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, '..'))

load_dotenv(os.path.join(BASE_DIR, '.env'))
load_dotenv(os.path.join(PROJECT_ROOT, '.env'))

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/zeilanparadise')


def _slugify(text: str) -> str:
    """Generate a clean URL slug from text."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    return re.sub(r'[-\s]+', '-', text)


def normalize_round_tour(item: dict) -> dict:
    """Standardize a Round Tour item from tours-uk.json to the exact schema."""
    tour_id = item.get('id') or f"tour-{_slugify(item.get('title', 'round-tour'))}"
    badge = item.get('badge', {})
    if not isinstance(badge, dict):
        badge = {"text": str(badge), "class": "bg-gold"}

    highlights = item.get('highlights', [])
    if not isinstance(highlights, list):
        highlights = [h.strip() for h in str(highlights).split(',') if h.strip()]

    return {
        "id": str(tour_id),
        "title": str(item.get('title', '')),
        "description": str(item.get('description', '')),
        "duration": str(item.get('duration', item.get('durationLabel', '10 Days'))),
        "durationLabel": str(item.get('durationLabel', item.get('duration', '10 Days'))),
        "targetAudience": str(item.get('targetAudience', '')),
        "guests": str(item.get('guests', '2–12 Guests')),
        "route": str(item.get('route', 'Colombo → Central Sri Lanka → Galle')),
        "category": str(item.get('category', 'cultural')),
        "type": "round",
        "badge": {
            "text": str(badge.get('text', 'Featured')),
            "class": str(badge.get('class', 'bg-gold'))
        },
        "image": str(item.get('image', 'images/tours/tour-cultural-triangle.jpg')),
        "priceType": str(item.get('priceType', 'From')),
        "priceDisplay": str(item.get('priceDisplay', 'Price on Request')),
        "priceTypeFull": str(item.get('priceTypeFull', 'Bespoke Private Journey')),
        "priceDisplayFull": str(item.get('priceDisplayFull', '• Price on Consultation')),
        "highlights": highlights,
        "itinerary": item.get('itinerary', []),
        "inclusions": item.get('inclusions', []),
        "exclusions": item.get('exclusions', []),
        "featured": bool(item.get('featured', True)),
        "market": str(item.get('market', 'uk'))
    }


def normalize_day_tour(item: dict) -> dict:
    """Standardize a Day Tour item from day-tours-uk.json to the exact schema."""
    title = item.get('title', 'Day Tour')
    tour_id = item.get('id') or f"day-tour-{_slugify(title)}"

    badge = item.get('badge', {})
    if not isinstance(badge, dict):
        badge = {"text": str(badge), "class": "bg-teal"}

    highlights = item.get('highlights', [
        "Private Guided Experience",
        "Chauffeured Vehicle",
        "Flexible Itinerary"
    ])
    if not isinstance(highlights, list):
        highlights = [h.strip() for h in str(highlights).split(',') if h.strip()]

    return {
        "id": str(tour_id),
        "title": str(title),
        "description": str(item.get('description', '')),
        "duration": str(item.get('duration', 'Full Day')),
        "startTime": str(item.get('startTime', '8:00 AM')),
        "guests": str(item.get('guests', 'Private (1 – 6 Guests)')),
        "route": str(item.get('route', '')),
        "category": str(item.get('category', 'cultural')),
        "type": "day",
        "badge": {
            "text": str(badge.get('text', 'Full Day')),
            "class": str(badge.get('class', 'bg-teal'))
        },
        "image": str(item.get('image', 'images/tours/day-tour-sigiriya.jpg')),
        "price": None,
        "pricingType": "bespoke",
        "priceType": str(item.get('priceType', 'Bespoke Quote')),
        "priceDisplay": str(item.get('priceDisplay', 'Tailor-made')),
        "highlights": highlights,
        "itinerary": item.get('itinerary', []),
        "inclusions": [
            "Private air-conditioned luxury vehicle with an English-speaking Chauffeur-Guide",
            "All entrance fees and permits for listed heritage sites and national parks",
            "24/7 dedicated local concierge support"
        ],
        "exclusions": [
            "Personal expenses and gratuities"
        ],
        "featured": bool(item.get('featured', False)),
        "market": str(item.get('market', 'uk'))
    }


def normalize_destination(item: dict) -> dict:
    """Standardize a Destination document."""
    name = item.get('name', 'Destination')
    dest_id = item.get('id') or f"dest-{_slugify(name)}"
    image_url = item.get('imageUrl') or item.get('image', f"images/destinations/{_slugify(name)}.jpg")

    return {
        "id": str(dest_id),
        "name": str(name),
        "tagline": str(item.get('tagline', '')),
        "description": str(item.get('description', '')),
        "tags": item.get('tags', []),
        "bestFor": item.get('tags', item.get('bestFor', [])),
        "region": str(item.get('region', 'Sri Lanka')),
        "imageUrl": str(image_url),
        "image": str(image_url),
        "isActive": bool(item.get('isActive', True)),
        "link": f"/destinations/{_slugify(name)}",
        "featured": bool(item.get('featured', True))
    }


def seed_database():
    """Main seeding logic for Tours and Destinations."""
    print("=" * 65)
    print("  ZEILAN PARADISE — MongoDB Atlas Database Seeding")
    print("=" * 65)

    # 1. Connect to MongoDB
    print(f"\n[1/4] Connecting to MongoDB Atlas...")
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        db_name = MONGO_URI.split('/')[-1].split('?')[0] or 'zeilanparadise'
        db = client.get_database(db_name)
        print(f"      Connected successfully to database: '{db.name}'")
    except Exception as e:
        print(f"\n[ERROR] Failed to connect to MongoDB: {e}")
        print("Please check your MONGO_URI connection string in backend/.env")
        return False

    # 2. Locate and read data files
    round_tours_path = os.path.join(PROJECT_ROOT, 'data', 'tours-uk.json')
    day_tours_path = os.path.join(PROJECT_ROOT, 'data', 'day-tours-uk.json')
    destinations_path = os.path.join(PROJECT_ROOT, 'data', 'destinations.json')

    with open(round_tours_path, 'r', encoding='utf-8') as f:
        raw_round = json.load(f)

    with open(day_tours_path, 'r', encoding='utf-8') as f:
        raw_day = json.load(f)

    with open(destinations_path, 'r', encoding='utf-8') as f:
        raw_destinations = json.load(f)

    # 3. Standardize and merge tours
    normalized_tours = []
    for item in raw_round:
        normalized_tours.append(normalize_round_tour(item))
    for item in raw_day:
        normalized_tours.append(normalize_day_tour(item))

    # 4. Standardize destinations
    normalized_destinations = []
    for item in raw_destinations:
        normalized_destinations.append(normalize_destination(item))

    print(f"\n[2/4] Standardized Data:")
    print(f"      - Round Tours: {len(raw_round)}")
    print(f"      - Day Tours:   {len(raw_day)}")
    print(f"      - Destinations: {len(normalized_destinations)}")

    # 5. Populate tours collection
    print(f"\n[3/4] Populating 'tours' collection...")
    db.tours.delete_many({})
    db.tours.insert_many(normalized_tours)
    print(f"      Inserted {len(normalized_tours)} tour documents successfully!")

    # 6. Populate destinations collection
    print(f"\n[4/4] Populating 'destinations' collection...")
    db.destinations.delete_many({})
    db.destinations.insert_many(normalized_destinations)
    print(f"      Inserted {len(normalized_destinations)} destination documents successfully!")

    print("\n" + "=" * 65)
    print("  [SUCCESS] All collections successfully seeded to MongoDB Atlas!")
    print("=" * 65)
    return True


if __name__ == '__main__':
    seed_database()
