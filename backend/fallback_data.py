"""
Zeilan Paradise — In-Memory Fallback Data
Used when MongoDB is not available. Ensures the API always returns rich data.
"""

FALLBACK_DESTINATIONS = [
    {
        "id": "dest-sigiriya",
        "name": "Sigiriya & Cultural Triangle",
        "tagline": "The Ancient Kingdoms",
        "image": "https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?w=800&auto=format&fit=crop&q=80",
        "link": "/destinations/sigiriya",
        "featured": True,
        "description": "Ascend the legendary Lion Rock, explore the cave temples of Dambulla, and discover the ancient capitals."
    },
    {
        "id": "dest-ella",
        "name": "Ella & The Tea Highlands",
        "tagline": "Emerald Peaks & Valleys",
        "image": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80",
        "link": "/destinations/ella",
        "featured": True,
        "description": "Journey through misty tea plantations, cross the iconic Nine Arches Bridge, and hike to breathtaking viewpoints."
    },
    {
        "id": "dest-mirissa",
        "name": "Mirissa & The South Coast",
        "tagline": "Golden Sands & Whales",
        "image": "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&auto=format&fit=crop&q=80",
        "link": "/destinations/mirissa",
        "featured": True,
        "description": "Watch blue whales breach at sunrise, surf pristine waves, and dine on the freshest seafood at sunset."
    },
    {
        "id": "dest-galle",
        "name": "Galle Fort",
        "tagline": "Colonial Charm",
        "image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=80",
        "link": "/destinations/galle",
        "featured": True,
        "description": "Wander the cobblestone streets of this UNESCO fortress, where Dutch colonial architecture meets Indian Ocean sunsets."
    },
    {
        "id": "dest-yala",
        "name": "Yala National Park",
        "tagline": "Untamed Wilderness",
        "image": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80",
        "link": "/destinations/yala",
        "featured": True,
        "description": "Home to the highest density of leopards in the world, alongside elephants, sloth bears, and over 200 bird species."
    }
]

FALLBACK_TOURS = [
    {
        "id": "rt-essence",
        "title": "The Essence of Zeilan",
        "description": "A meticulously balanced 10-day journey combining ancient culture, lush highlands, and pristine southern beaches.",
        "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
        "duration": "10 Days",
        "guests": "2 - 6",
        "route": "Negombo → Sigiriya → Kandy → Ella → Yala → Galle",
        "priceType": "From",
        "priceDisplay": "£1,450",
        "price": 1450,
        "currency": "GBP",
        "link": "/round-tours/essence",
        "type": "round",
        "market": "uk",
        "featured": True,
        "badge": {"text": "Most Popular", "class": "bg-gold"}
    },
    {
        "id": "rt-wild",
        "title": "Untamed Sri Lanka",
        "description": "Venture deep into the wilderness. Safari drives, luxury tented camps, and exclusive leopard tracking experiences.",
        "image": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80",
        "duration": "12 Days",
        "guests": "2 - 4",
        "route": "Wilpattu → Minneriya → Gal Oya → Yala",
        "priceType": "From",
        "priceDisplay": "£2,100",
        "price": 2100,
        "currency": "GBP",
        "link": "/round-tours/wild",
        "type": "round",
        "market": "uk",
        "featured": True,
        "badge": {"text": "Luxury Explorer", "class": "bg-teal"}
    },
    {
        "id": "rt-wellness",
        "title": "Ayurveda & Wellness Retreat",
        "description": "Rejuvenate your soul with holistic Ayurvedic treatments, daily yoga, and serene beachfront luxury.",
        "image": "https://images.unsplash.com/photo-1521651201144-634f700b36ef?w=800&auto=format&fit=crop&q=80",
        "duration": "14 Days",
        "guests": "Solo or Couples",
        "route": "Weligama → Tangalle → Bentota",
        "priceType": "From",
        "priceDisplay": "£1,890",
        "price": 1890,
        "currency": "GBP",
        "link": "/round-tours/wellness",
        "type": "round",
        "market": "uk",
        "featured": True,
        "badge": {"text": "Wellness", "class": "bg-charcoal"}
    }
]

FALLBACK_TESTIMONIALS = [
    {
        "id": "testi-1",
        "text": "From our very first enquiry to the moment we landed back in Heathrow, the service was impeccable. Our guide, Nuwan, was exceptional.",
        "authorName": "Eleanor & James",
        "authorLocation": "London, UK",
        "authorImage": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80",
        "market": "uk",
        "rating": 5
    },
    {
        "id": "testi-2",
        "text": "Zeilan Paradise arranged a private anniversary dinner for us in the tea hills overlooking Ella Gap. It brought me to tears. Pure magic.",
        "authorName": "Sarah M.",
        "authorLocation": "Manchester, UK",
        "authorImage": "https://images.unsplash.com/photo-1508214751196-bfd141285cb6?w=200&auto=format&fit=crop&q=80",
        "market": "uk",
        "rating": 5
    },
    {
        "id": "testi-3",
        "text": "As seasoned travellers, we expect a lot. Zeilan exceeded every standard. The boutique hotels they selected were breathtaking.",
        "authorName": "The Harrison Family",
        "authorLocation": "Surrey, UK",
        "authorImage": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
        "market": "uk",
        "rating": 5
    }
]
