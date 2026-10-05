"""
Zeilan Paradise — MongoDB Connection Module
Handles connection to MongoDB and provides collection accessors.
"""
from pymongo import MongoClient
from config import Config
from fallback_data import FALLBACK_DESTINATIONS, FALLBACK_TOURS

client = None
db = None


def init_db():
    """Initialize the MongoDB connection."""
    global client, db
    try:
        client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=15000, connectTimeoutMS=15000)
        # Attempt a quick ping to verify connection
        client.admin.command('ping')
        db = client.get_database('zeilanparadise')
        print(f"  [DB] MongoDB connected: {db.name}")
        _seed_initial_data()
    except Exception as e:
        print(f"  [WARN] MongoDB not available ({e}). Using in-memory fallback data.")
        db = None


def get_db():
    """Return the database instance."""
    return db


def _seed_initial_data():
    """Seed an empty database with the real tour and destination catalogue.

    Testimonials are deliberately not seeded: only genuine guest reviews should appear.
    """
    if db is None:
        return

    if db.destinations.count_documents({}) == 0:
        db.destinations.insert_many([dict(d) for d in FALLBACK_DESTINATIONS])
        print("    [SEED] Seeded destinations collection.")

    if db.tours.count_documents({}) == 0:
        db.tours.insert_many([dict(t) for t in FALLBACK_TOURS])
        print("    [SEED] Seeded tours collection.")
