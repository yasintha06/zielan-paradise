"""
Zeilan Paradise — In-Memory Fallback Data
Used when MongoDB is not available. Ensures the API always returns rich data.
"""

FALLBACK_DESTINATIONS = [
    {
        "id": "dest-sigiriya",
        "name": "Sigiriya",
        "tagline": "The Ancient Citadel",
        "description": "Ascend the legendary Lion Rock fortress and explore the royal water gardens of this 5th-century architectural marvel.",
        "tags": ["History", "Photography", "Hiking"],
        "bestFor": ["History", "Photography", "Hiking"],
        "region": "Cultural Triangle",
        "imageUrl": "https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?w=800&auto=format&fit=crop&q=80",
        "image": "https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?w=800&auto=format&fit=crop&q=80",
        "isActive": True,
        "featured": True
    },
    {
        "id": "dest-anuradhapura",
        "name": "Anuradhapura",
        "tagline": "Sacred Ancient Wonders",
        "description": "Marvel at towering white stupas, the sacred Sri Maha Bodhi tree, and the sprawling ruins of Sri Lanka's first ancient kingdom.",
        "tags": ["Ancient Wonders", "Spirituality", "UNESCO Heritage"],
        "bestFor": ["Ancient Wonders", "Spirituality", "UNESCO Heritage"],
        "region": "Cultural Triangle",
        "imageUrl": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=80",
        "image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=80",
        "isActive": True,
        "featured": True
    },
    {
        "id": "dest-dambulla",
        "name": "Dambulla",
        "tagline": "Golden Cave Temples",
        "description": "Discover centuries-old golden cave temple murals and hundreds of sacred Buddha statues carved directly into the rock face.",
        "tags": ["Culture", "Spirituality", "History"],
        "bestFor": ["Culture", "Spirituality", "History"],
        "region": "Cultural Triangle",
        "imageUrl": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80",
        "image": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80",
        "isActive": True,
        "featured": True
    },
    {
        "id": "dest-ella",
        "name": "Ella",
        "tagline": "Emerald Peaks & Valleys",
        "description": "Journey through misty tea plantations, cross the iconic Nine Arches Bridge, and hike to breathtaking viewpoints above the clouds.",
        "tags": ["Nature", "Hiking", "Train Rides"],
        "bestFor": ["Nature", "Hiking", "Train Rides"],
        "region": "Hill Country",
        "imageUrl": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80",
        "image": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80",
        "isActive": True,
        "featured": True
    },
    {
        "id": "dest-mirissa",
        "name": "Mirissa",
        "tagline": "Golden Sands & Whales",
        "description": "Watch blue whales breach at sunrise, surf pristine waves, and dine on the freshest seafood at sunset on golden beaches.",
        "tags": ["Beach", "Whale Watching", "Surfing"],
        "bestFor": ["Beach", "Whale Watching", "Surfing"],
        "region": "South Coast",
        "imageUrl": "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&auto=format&fit=crop&q=80",
        "image": "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&auto=format&fit=crop&q=80",
        "isActive": True,
        "featured": True
    },
    {
        "id": "dest-galle-fort",
        "name": "Galle Fort",
        "tagline": "Colonial Charm",
        "description": "Wander the cobblestone streets of this UNESCO fortress, where Dutch colonial architecture meets Indian Ocean sunsets and boutique galleries.",
        "tags": ["History", "Shopping", "Architecture"],
        "bestFor": ["History", "Shopping", "Architecture"],
        "region": "South Coast",
        "imageUrl": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=80",
        "image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=80",
        "isActive": True,
        "featured": True
    },
    {
        "id": "dest-yala-national-park",
        "name": "Yala National Park",
        "tagline": "Untamed Wilderness",
        "description": "Home to the highest density of leopards in the world, alongside elephants, sloth bears, and over 200 bird species in stunning landscapes.",
        "tags": ["Wildlife", "Photography", "Safari"],
        "bestFor": ["Wildlife", "Photography", "Safari"],
        "region": "South East",
        "imageUrl": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80",
        "image": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80",
        "isActive": True,
        "featured": True
    },
    {
        "id": "dest-kandy",
        "name": "Kandy",
        "tagline": "Sacred Hill Capital",
        "description": "Home to the Temple of the Tooth Relic and surrounded by lush hills, Kandy is the cultural heart of Sri Lanka — steeped in royal heritage.",
        "tags": ["Culture", "Temples", "Gardens"],
        "bestFor": ["Culture", "Temples", "Gardens"],
        "region": "Hill Country",
        "imageUrl": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
        "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
        "isActive": True,
        "featured": True
    },
    {
        "id": "dest-nuwara-eliya",
        "name": "Nuwara Eliya",
        "tagline": "Little England in the Hills",
        "description": "Stroll through emerald tea estates, visit historic colonial factories, and savor Ceylon high tea amidst mist-kissed hills.",
        "tags": ["Tea Tasting", "Cool Climate", "Colonial Heritage"],
        "bestFor": ["Tea Tasting", "Cool Climate", "Colonial Heritage"],
        "region": "Hill Country",
        "imageUrl": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80",
        "image": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80",
        "isActive": True,
        "featured": True
    }
]

FALLBACK_TOURS = [
    {
        "id": "tour-grand-island-odyssey",
        "title": "The Grand Island Odyssey",
        "duration": "14 Days / 13 Nights",
        "durationLabel": "⏱ 14 Days / 13 Nights",
        "targetAudience": "First-time travelers seeking a comprehensive, leisurely luxury loop",
        "route": "Negombo → Cultural Triangle → Kandy → Hatton / Nuwara Eliya → Ella → Yala → Galle Fort → Colombo",
        "category": "14",
        "type": "round",
        "badge": {"text": "Signature 14-Day Tour", "class": "bg-gold"},
        "image": "images/tours/tour-grand-odyssey.jpg",
        "priceType": "Signature Luxury",
        "priceDisplay": "Price on Request",
        "priceTypeFull": "Signature Grand Tour",
        "priceDisplayFull": "• Bespoke Luxury Quotation",
        "link": "round-tours.html",
        "featured": True,
        "market": "uk",
        "highlights": [
            "Sunrise ascent of the Sigiriya Lion Rock fortress before peak midday heat",
            "Exploration of the Polonnaruwa medieval ruins by bicycle or private buggy",
            "Chanted evening Theva puja service at the Temple of the Sacred Tooth Relic in Kandy",
            "The scenic hill country mainline train ride through working tea plantations",
            "Two private leopard and elephant game drives in Yala National Park with an experienced naturalist",
            "Leisurely walking tour across the 17th-century ramparts of UNESCO-listed Galle Fort"
        ],
        "inclusions": [
            "Private air-conditioned luxury vehicle with an English-speaking Chauffeur-Guide",
            "All entrance fees and permits for listed heritage sites and national parks",
            "Private 4x4 safari jeeps with park tracker/naturalist",
            "First-class reserved observation rail tickets (subject to availability)",
            "Daily breakfast and designated gourmet meal experiences",
            "Highway toll charges, fuel, chauffeur accommodation and meals",
            "24/7 dedicated local concierge support"
        ],
        "exclusions": [
            "International flights and Sri Lanka ETA tourist visa fees",
            "Discretionary driver/guide gratuities",
            "Travel insurance (mandatory for booking)",
            "Alcoholic beverages and personal expenses"
        ]
    },
    {
        "id": "tour-wild-heritage-highlands",
        "title": "Wild Heritage & Highlands",
        "duration": "10 Days / 9 Nights",
        "durationLabel": "⏱ 10 Days / 9 Nights",
        "targetAudience": "Wildlife enthusiasts, active couples, and photography buffs",
        "route": "Negombo → Wilpattu National Park → Sigiriya → Kandy → Ella → Yala → Southern Beach",
        "category": "10",
        "type": "round",
        "badge": {"text": "Wildlife & Adventure", "class": "bg-teal"},
        "image": "images/tours/tour-cultural-triangle.jpg",
        "priceType": "Curated Private Tour",
        "priceDisplay": "Price on Request",
        "priceTypeFull": "Curated Wildlife Safari",
        "priceDisplayFull": "• Bespoke Luxury Quotation",
        "link": "round-tours.html",
        "featured": True,
        "market": "uk",
        "highlights": [
            "Remote leopard tracking in Wilpattu's undisturbed natural lake basins (Villus)",
            "Sunset hike up Pidurangala Rock with panoramic views facing Sigiriya",
            "Guided wildlife and bird-watching expeditions in two distinct national parks",
            "Classic colonial rail passage through misty highland passes",
            "Coastal relaxation on the golden beaches of Mirissa"
        ],
        "inclusions": [
            "Private air-conditioned luxury vehicle with an English-speaking Chauffeur-Guide",
            "All entrance fees and permits for listed heritage sites and national parks",
            "Private 4x4 safari jeeps with park tracker/naturalist",
            "First-class reserved observation rail tickets (subject to availability)",
            "Daily breakfast and designated gourmet meal experiences",
            "Highway toll charges, fuel, chauffeur accommodation and meals",
            "24/7 dedicated local concierge support"
        ],
        "exclusions": [
            "International flights and Sri Lanka ETA tourist visa fees",
            "Discretionary driver/guide gratuities",
            "Travel insurance (mandatory for booking)",
            "Alcoholic beverages and personal expenses"
        ]
    },
    {
        "id": "tour-tea-trails-coastal-sanctuaries",
        "title": "Tea Trails & Coastal Sanctuaries",
        "duration": "8 Days / 7 Nights",
        "durationLabel": "⏱ 8 Days / 7 Nights",
        "targetAudience": "Travelers seeking romance, boutique relaxation, and slow travel",
        "route": "Colombo → Tea Country (Hatton/Castlereagh) → Galle Fort → Bentota → Airport",
        "category": "8",
        "type": "round",
        "badge": {"text": "Boutique & Romance", "class": "bg-charcoal"},
        "image": "images/tours/day-tour-tea.jpg",
        "priceType": "Luxury Boutique",
        "priceDisplay": "Price on Request",
        "priceTypeFull": "Boutique Tea & Coastal Haven",
        "priceDisplayFull": "• Bespoke Luxury Quotation",
        "link": "round-tours.html",
        "featured": True,
        "market": "uk",
        "highlights": [
            "Stay in heritage tea bungalows amidst rolling hills and private lakeside estates",
            "Artisan culinary walks through Galle Fort paired with fine dining",
            "Private ocean catamaran sailings and golden sand beaches",
            "Gentle pace with limited drive times and maximum relaxation"
        ],
        "inclusions": [
            "Private air-conditioned luxury vehicle with an English-speaking Chauffeur-Guide",
            "All entrance fees and permits for listed heritage sites and national parks",
            "Private 4x4 safari jeeps with park tracker/naturalist",
            "First-class reserved observation rail tickets (subject to availability)",
            "Daily breakfast and designated gourmet meal experiences",
            "Highway toll charges, fuel, chauffeur accommodation and meals",
            "24/7 dedicated local concierge support"
        ],
        "exclusions": [
            "International flights and Sri Lanka ETA tourist visa fees",
            "Discretionary driver/guide gratuities",
            "Travel insurance (mandatory for booking)",
            "Alcoholic beverages and personal expenses"
        ]
    },
    {
        "id": "tour-essence-of-ceylon",
        "title": "Essence of Ceylon",
        "duration": "7 Days / 6 Nights",
        "durationLabel": "⏱ 7 Days / 6 Nights",
        "targetAudience": "Short-break travelers seeking the essential cultural highlights and southern sea",
        "route": "Airport → Sigiriya → Kandy → Galle → Airport",
        "category": "7",
        "type": "round",
        "badge": {"text": "Essential Sri Lanka", "class": "bg-teal"},
        "image": "images/tours/tour-southern-coast.jpg",
        "priceType": "Classic Private Tour",
        "priceDisplay": "Price on Request",
        "priceTypeFull": "Curated Essential Highlights",
        "priceDisplayFull": "• Bespoke Luxury Quotation",
        "link": "round-tours.html",
        "featured": True,
        "market": "uk",
        "highlights": [
            "Direct access to the country's two most renowned UNESCO cultural monuments: Sigiriya and Kandy",
            "Dense, high-value 7-day loop without excessive packing and unpacking",
            "Coastal finale within the historic ramparts of Galle Fort"
        ],
        "inclusions": [
            "Private air-conditioned luxury vehicle with an English-speaking Chauffeur-Guide",
            "All entrance fees and permits for listed heritage sites and national parks",
            "Private 4x4 safari jeeps with park tracker/naturalist",
            "First-class reserved observation rail tickets (subject to availability)",
            "Daily breakfast and designated gourmet meal experiences",
            "Highway toll charges, fuel, chauffeur accommodation and meals",
            "24/7 dedicated local concierge support"
        ],
        "exclusions": [
            "International flights and Sri Lanka ETA tourist visa fees",
            "Discretionary driver/guide gratuities",
            "Travel insurance (mandatory for booking)",
            "Alcoholic beverages and personal expenses"
        ]
    },
    {
        "id": "day-tour-yala",
        "title": "Yala National Park Safari",
        "category": "wildlife",
        "type": "day",
        "duration": "Full Day",
        "badge": {"text": "Full Day", "class": "teal"},
        "image": "images/tours/day-tour-yala.jpg",
        "description": "An exclusive private 4x4 safari through Sri Lanka's premier wildlife sanctuary, accompanied by an experienced tracker.",
        "highlights": [
            "Private open-top jeep",
            "Leopard & elephant tracking",
            "Picnic refreshment setup"
        ],
        "startTime": "5:30 AM (Morning) or 2:00 PM (Afternoon)",
        "guests": "Private (1 – 6 Guests)",
        "price": None,
        "pricingType": "bespoke",
        "priceType": "Bespoke Quote",
        "priceDisplay": "Tailor-made",
        "link": "contact.html"
    },
    {
        "id": "day-tour-sigiriya",
        "title": "Sigiriya Citadel & Dambulla Cave Temples",
        "category": "cultural",
        "type": "day",
        "duration": "Full Day",
        "badge": {"text": "Full Day", "class": ""},
        "image": "images/tours/day-tour-sigiriya.jpg",
        "description": "Ascend the ancient 5th-century Lion Rock fortress and explore the painted cave sanctuaries of Dambulla in a single cultural loop.",
        "highlights": [
            "UNESCO Sigiriya Fortress",
            "Dambulla Cave Murals",
            "Traditional village lunch"
        ],
        "startTime": "7:00 AM",
        "guests": "Private (1 – 8 Guests)",
        "price": None,
        "pricingType": "bespoke",
        "priceType": "Bespoke Quote",
        "priceDisplay": "Tailor-made",
        "link": "contact.html"
    },
    {
        "id": "day-tour-whale",
        "title": "Mirissa Ocean Whale Expedition",
        "category": "coast",
        "type": "day",
        "duration": "Half Day",
        "badge": {"text": "Half Day", "class": "teal"},
        "image": "images/tours/day-tour-whale.jpg",
        "description": "Set sail at dawn into the deep southern waters to observe migrating blue whales, sperm whales, and spinner dolphins.",
        "highlights": [
            "Blue whale & dolphin sightings",
            "Marine safety equipment",
            "Refreshments at sea"
        ],
        "startTime": "6:00 AM (Seasonal: Nov – Apr)",
        "guests": "2 – 8 Guests",
        "price": None,
        "pricingType": "bespoke",
        "priceType": "Bespoke Quote",
        "priceDisplay": "Tailor-made",
        "link": "contact.html"
    },
    {
        "id": "day-tour-kandy",
        "title": "Kandy Royal Heritage & Tea Trails",
        "category": "cultural",
        "type": "day",
        "duration": "Full Day",
        "badge": {"text": "Full Day", "class": ""},
        "image": "images/tours/day-tour-kandy.jpg",
        "description": "Experience the sacred rituals of the Temple of the Tooth, wander the Royal Botanic Gardens, and explore a working mountain tea estate.",
        "highlights": [
            "Temple of the Sacred Tooth Relic",
            "Peradeniya Botanic Gardens",
            "Orthodox tea factory tour & tasting"
        ],
        "startTime": "8:00 AM",
        "guests": "Private (1 – 8 Guests)",
        "price": None,
        "pricingType": "bespoke",
        "priceType": "Bespoke Quote",
        "priceDisplay": "Tailor-made",
        "link": "contact.html"
    },
    {
        "id": "day-tour-galle",
        "title": "Galle Fort & Southern Maritime Heritage",
        "category": "coast",
        "type": "day",
        "duration": "Full Day",
        "badge": {"text": "Full Day", "class": ""},
        "image": "images/tours/day-tour-galle.jpg",
        "description": "Stroll the 17th-century ramparts of this living Dutch citadel, cruise the coastal mangrove lagoons, and visit a sea turtle sanctuary.",
        "highlights": [
            "UNESCO Galle Fort walking tour",
            "Madu Ganga river safari",
            "Marine turtle conservation project"
        ],
        "startTime": "8:30 AM",
        "guests": "Private (1 – 6 Guests)",
        "price": None,
        "pricingType": "bespoke",
        "priceType": "Bespoke Quote",
        "priceDisplay": "Tailor-made",
        "link": "contact.html"
    },
    {
        "id": "day-tour-tea",
        "title": "Nuwara Eliya Highlands & High Tea",
        "category": "highlands",
        "type": "day",
        "duration": "Full Day",
        "badge": {"text": "Full Day", "class": "teal"},
        "image": "images/tours/day-tour-tea.jpg",
        "description": "Journey into the misty tea country, walk through heritage rolling estates, and experience classic Ceylon high tea.",
        "highlights": [
            "Colonial architecture of 'Little England'",
            "Factory processing masterclass",
            "Fine highland tea tasting"
        ],
        "startTime": "7:30 AM",
        "guests": "Private (1 – 6 Guests)",
        "price": None,
        "pricingType": "bespoke",
        "priceType": "Bespoke Quote",
        "priceDisplay": "Tailor-made",
        "link": "contact.html"
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
