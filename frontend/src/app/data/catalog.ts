/**
 * Built-in copy of the tour and destination catalogue (generated from /data/*.json).
 * Used when the API is unreachable so the site never shows empty pages.
 */
import { Tour } from '../services/tour.service';
import { Destination } from '../services/destination.service';

export const ROUND_TOURS: Tour[] = [
  {
    "id": "tour-grand-island-odyssey",
    "title": "The Grand Island Odyssey",
    "duration": "14 Days / 13 Nights",
    "targetAudience": "First-time travelers seeking a comprehensive, leisurely luxury loop",
    "route": "Negombo → Cultural Triangle → Kandy → Hatton / Nuwara Eliya → Ella → Yala → Galle Fort → Colombo",
    "category": "14",
    "type": "round",
    "badge": {
      "text": "Signature 14-Day Tour",
      "class": "bg-gold"
    },
    "image": "images/tours/tour-grand-odyssey.jpg",
    "priceType": "Signature Luxury",
    "priceDisplay": "Price on Request",
    "priceTypeFull": "Signature Grand Tour",
    "priceDisplayFull": "• Bespoke Luxury Quotation",
    "featured": true,
    "market": "uk",
    "highlights": [
      "Sunrise ascent of the Sigiriya Lion Rock fortress before peak midday heat",
      "Exploration of the Polonnaruwa medieval ruins by bicycle or private buggy",
      "Chanted evening Theva puja service at the Temple of the Sacred Tooth Relic in Kandy",
      "The scenic hill country mainline train ride through working tea plantations",
      "Two private leopard and elephant game drives in Yala National Park with an experienced naturalist",
      "Leisurely walking tour across the 17th-century ramparts of UNESCO-listed Galle Fort"
    ],
    "itinerary": [
      {
        "day": "Day 1",
        "title": "Arrival & Coastal Decompression",
        "location": "Negombo",
        "description": "Arrival at Bandaranaike International Airport (CMB). Meet private chauffeur-guide; short 25-minute transfer to a coastal boutique retreat in Negombo. Rest and unwind by the Indian Ocean."
      },
      {
        "day": "Day 2",
        "title": "Coastal Wetlands to the Cultural Triangle",
        "location": "Dambulla & Sigiriya",
        "description": "Drive inland toward the Cultural Triangle (approx. 4 hours). Stop en route at the Dambulla Cave Temple complex to explore the five sacred rock-cut sanctuaries filled with ancient Buddhist mural art. Check in to a tranquil jungle retreat."
      },
      {
        "day": "Day 3",
        "title": "The Sky Citadel & Rural Heritage",
        "location": "Sigiriya & Minneriya",
        "description": "Early morning ascent of Sigiriya Rock Fortress (5th-century palace citadel) to beat heat and crowds. Afternoon 4x4 open-top jeep safari in Minneriya/Kaudulla National Park to witness the seasonal gathering of wild elephant herds."
      },
      {
        "day": "Day 4",
        "title": "Ancient Kings & Royal Reservoirs",
        "location": "Polonnaruwa",
        "description": "Visit the ancient capital of Polonnaruwa, cycling among monumental stone stupas and the Gal Vihara rock reliefs. Traditional lakeside lunch prepared in clay pots at a local farming village."
      },
      {
        "day": "Day 5",
        "title": "Sacred Peaks to the Royal Capital",
        "location": "Kandy",
        "description": "Scenic transfer south to Kandy (approx. 2.5 hours) with an aromatic walk through an ethical spice estate in Matale. Experience the rhythmic drums and traditional evening prayer ceremony at Sri Dalada Maligawa (Temple of the Sacred Tooth Relic)."
      },
      {
        "day": "Day 6",
        "title": "Botanical Splendor & Crafts",
        "location": "Kandy",
        "description": "Guided stroll across the Royal Botanic Gardens, Peradeniya, home to an extensive orchid collection and royal palm avenues. Scenic lake drive, gemstone museum visit, and an evening cultural drum and dance performance."
      },
      {
        "day": "Day 7",
        "title": "The Emerald Tea Valleys",
        "location": "Hatton / Nuwara Eliya",
        "description": "Drive through winding highlands lined with cascading waterfalls (approx. 2.5–3 hours). Private tour of a working orthodox tea factory; masterclass on tea plucking, rolling, drying, and an estate-grade tea tasting."
      },
      {
        "day": "Day 8",
        "title": "High Plains & Panorama",
        "location": "Horton Plains & Nuwara Eliya",
        "description": "Dawn excursion to Horton Plains National Park; trek to the 1,200m drop at World's End and Baker's Falls. Explore 'Little England,' visiting Victoria Park, the colonial Queen's Hotel, and Gregory Lake."
      },
      {
        "day": "Day 9",
        "title": "The Mainline Scenic Rail to Ella",
        "location": "Ella",
        "description": "Board the morning observation-class scenic train from Nanu Oya to Ella through tea plantations and cloud forests. Walk along the tracks to the Nine Arches Bridge to photograph passing trains; easy hike to Little Adam's Peak for sunset."
      },
      {
        "day": "Day 10",
        "title": "Down into the Southern Wilds",
        "location": "Yala National Park",
        "description": "Descend the southern mountain escarpment via Ravana Falls toward the arid southern coastal plain (approx. 3 hours). First private open-top 4x4 evening safari in Yala National Park scouting for leopards, sloth bears, and mugger crocodiles."
      },
      {
        "day": "Day 11",
        "title": "Dawn Safari & Southern Coastline",
        "location": "Galle Fort",
        "description": "Early-morning second game drive in Yala Block 1. Return for late brunch. Drive west along the southern coastline past Weligama to the Dutch colonial fortress of Galle (approx. 2.5 hours)."
      },
      {
        "day": "Day 12",
        "title": "Colonial Bastions & Artisan Alleys",
        "location": "Galle Fort",
        "description": "Private architecture and history walking tour within the fortified walls of Galle Fort, exploring cobblestone streets, antique stores, and historic bastions. Free afternoon to relax at nearby Thalpe beach or enjoy an Ayurvedic treatment."
      },
      {
        "day": "Day 13",
        "title": "Ocean Sunsets & Stilt Fishermen",
        "location": "Southern Coast & Bentota",
        "description": "Dedicated slow-travel day. Options to visit a sea turtle conservation hatchery in Kosgoda, take an estuary river boat cruise on the Madu Ganga, or relax along the beach."
      },
      {
        "day": "Day 14",
        "title": "Departure & Farewell",
        "location": "Colombo Airport",
        "description": "Transfer directly via the Southern Expressway (approx. 2 hours) to Bandaranaike International Airport (CMB) for outward flight."
      }
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
    "targetAudience": "Wildlife enthusiasts, active couples, and photography buffs",
    "route": "Negombo → Wilpattu National Park → Sigiriya → Kandy → Ella → Yala → Southern Beach",
    "category": "10",
    "type": "round",
    "badge": {
      "text": "Wildlife & Adventure",
      "class": "bg-teal"
    },
    "image": "images/tours/tour-cultural-triangle.jpg",
    "priceType": "Curated Private Tour",
    "priceDisplay": "Price on Request",
    "priceTypeFull": "Curated Wildlife Safari",
    "priceDisplayFull": "• Bespoke Luxury Quotation",
    "featured": true,
    "market": "uk",
    "highlights": [
      "Remote leopard tracking in Wilpattu's undisturbed natural lake basins (Villus)",
      "Sunset hike up Pidurangala Rock with panoramic views facing Sigiriya",
      "Guided wildlife and bird-watching expeditions in two distinct national parks",
      "Classic colonial rail passage through misty highland passes",
      "Coastal relaxation on the golden beaches of Mirissa"
    ],
    "itinerary": [
      {
        "day": "Day 1",
        "title": "Arrival in Sri Lanka",
        "location": "Negombo",
        "description": "Arrival at CMB Airport; short transfer to Negombo boutique hotel for rest and ocean decompression."
      },
      {
        "day": "Day 2",
        "title": "Untamed Wilpattu Safari",
        "location": "Wilpattu National Park",
        "description": "Negombo to Wilpattu National Park; afternoon 4x4 wilderness safari tracking wild sloth bears and leopards around natural lakes."
      },
      {
        "day": "Day 3",
        "title": "Kingdom of Sigiriya & Pidurangala",
        "location": "Sigiriya",
        "description": "Wilpattu to Sigiriya; evening sunset climb atop Pidurangala Rock with 360-degree panoramic views of Lion Rock."
      },
      {
        "day": "Day 4",
        "title": "Sky Citadel & Elephant Corridors",
        "location": "Sigiriya & Minneriya",
        "description": "Sunrise climb of Sigiriya Fortress; afternoon exploration of rural ancient irrigation tanks and Minneriya elephant corridors."
      },
      {
        "day": "Day 5",
        "title": "Sacred Golden Caves & Hill Capital",
        "location": "Dambulla & Kandy",
        "description": "Dambulla Cave Temple en route to Kandy; evening visit to the sacred Temple of the Tooth Relic."
      },
      {
        "day": "Day 6",
        "title": "Misty Highland Rail to Ella",
        "location": "Ella",
        "description": "Kandy to Ella via scenic hill country train ride; evening walk along Nine Arches Bridge and Little Adam's Peak."
      },
      {
        "day": "Day 7",
        "title": "Escarpment Descent to Yala",
        "location": "Yala National Park",
        "description": "Ella to Yala; descend the southern mountain escarpment to the lowlands; evening leopard safari drive in Yala."
      },
      {
        "day": "Day 8",
        "title": "Dawn Game Drive & Ocean Coast",
        "location": "Yala & Mirissa",
        "description": "Dawn safari in Yala National Park Block 1; transfer along the southern coast past Weligama to Mirissa."
      },
      {
        "day": "Day 9",
        "title": "Whale Watching & Golden Shores",
        "location": "Mirissa",
        "description": "Whale-watching excursion (seasonal: Nov–April) or relaxed day on Mirissa beach with fresh seafood dining."
      },
      {
        "day": "Day 10",
        "title": "Galle Fort & Airport Departure",
        "location": "Galle & CMB Airport",
        "description": "Scenic drive past Galle Fort ramparts, then express transfer via Southern Expressway to CMB Airport for departure."
      }
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
    "targetAudience": "Travelers seeking romance, boutique relaxation, and slow travel",
    "route": "Colombo → Tea Country (Hatton/Castlereagh) → Galle Fort → Bentota → Airport",
    "category": "8",
    "type": "round",
    "badge": {
      "text": "Boutique & Romance",
      "class": "bg-charcoal"
    },
    "image": "images/tours/day-tour-tea.jpg",
    "priceType": "Luxury Boutique",
    "priceDisplay": "Price on Request",
    "priceTypeFull": "Boutique Tea & Coastal Haven",
    "priceDisplayFull": "• Bespoke Luxury Quotation",
    "featured": true,
    "market": "uk",
    "highlights": [
      "Stay in heritage tea bungalows amidst rolling hills and private lakeside estates",
      "Artisan culinary walks through Galle Fort paired with fine dining",
      "Private ocean catamaran sailings and golden sand beaches",
      "Gentle pace with limited drive times and maximum relaxation"
    ],
    "itinerary": [
      {
        "day": "Day 1",
        "title": "Colombo Heritage & Sunset Cocktails",
        "location": "Colombo",
        "description": "Arrival in Colombo; evening architectural tour of colonial Fort and vintage sunset cocktails at Galle Face Hotel."
      },
      {
        "day": "Day 2",
        "title": "Ascent to Tea Country Estates",
        "location": "Hatton / Castlereagh",
        "description": "Transfer to Hatton / Castlereagh Reservoir (approx. 4.5 hours); check into a restored heritage tea planter's bungalow."
      },
      {
        "day": "Day 3",
        "title": "Tea Masterclass & Lake Panoramas",
        "location": "Castlereagh Reservoir",
        "description": "Private garden tea-tasting experience, gentle estate walking trails, and afternoon cream tea overlooking the misty lake."
      },
      {
        "day": "Day 4",
        "title": "Descent to the Colonial Coast",
        "location": "Galle Fort",
        "description": "Descend through rubber plantations and winding rivers directly toward the southern coast to Galle (approx. 4 hours)."
      },
      {
        "day": "Day 5",
        "title": "Galle Fort Historic Walk",
        "location": "Galle Fort",
        "description": "Walking tour of UNESCO Galle Fort with an architectural historian; sunset drinks on the lighthouse wall."
      },
      {
        "day": "Day 6",
        "title": "Tropical Modernism at Lunuganga",
        "location": "Bentota",
        "description": "Transfer to Bentota; visit Geoffrey Bawa's legendary tropical modernist country estate, Lunuganga."
      },
      {
        "day": "Day 7",
        "title": "Ayurveda Wellness & Candlelight Dining",
        "location": "Bentota Beach",
        "description": "Leisurely coastal day; private Ayurvedic wellness treatment, golden beach walk, and candlelight seafood dinner."
      },
      {
        "day": "Day 8",
        "title": "Express Highway Transfer to CMB",
        "location": "Colombo Airport",
        "description": "90-minute highway transfer directly to Bandaranaike International Airport (CMB) for departure flight."
      }
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
    "targetAudience": "Short-break travelers seeking the essential cultural highlights and southern sea",
    "route": "Airport → Sigiriya → Kandy → Galle → Airport",
    "category": "7",
    "type": "round",
    "badge": {
      "text": "Essential Sri Lanka",
      "class": "bg-teal"
    },
    "image": "images/tours/tour-southern-coast.jpg",
    "priceType": "Classic Private Tour",
    "priceDisplay": "Price on Request",
    "priceTypeFull": "Curated Essential Highlights",
    "priceDisplayFull": "• Bespoke Luxury Quotation",
    "featured": true,
    "market": "uk",
    "highlights": [
      "Direct access to the country's two most renowned UNESCO cultural monuments: Sigiriya and Kandy",
      "Dense, high-value 7-day loop without excessive packing and unpacking",
      "Coastal finale within the historic ramparts of Galle Fort"
    ],
    "itinerary": [
      {
        "day": "Day 1",
        "title": "Arrival to the Ancient Triangle",
        "location": "Sigiriya",
        "description": "Morning arrival at CMB; express transfer north to the Cultural Triangle (Sigiriya). Evening relaxing at a forest retreat."
      },
      {
        "day": "Day 2",
        "title": "Sigiriya Rock & Elephant Safari",
        "location": "Sigiriya & Minneriya",
        "description": "Early climb of Sigiriya Lion Rock; afternoon safari at Minneriya National Park for the wild elephant gathering."
      },
      {
        "day": "Day 3",
        "title": "Dambulla Murals & Temple of the Tooth",
        "location": "Kandy",
        "description": "Visit Dambulla Golden Rock Cave Temples, continuing south to Kandy; evening service at the Temple of the Sacred Tooth Relic."
      },
      {
        "day": "Day 4",
        "title": "Royal Gardens & Mountain Cascades",
        "location": "Kandy to Galle",
        "description": "Morning stroll through the Royal Botanic Gardens; scenic drive past highland cascades south toward Galle."
      },
      {
        "day": "Day 5",
        "title": "Exploring Colonial Galle Fort",
        "location": "Galle Fort",
        "description": "Full day discovering Galle Fort's artisanal boutiques, gem traders, ramparts, and historic Dutch Reformed Church."
      },
      {
        "day": "Day 6",
        "title": "Palm-Fringed Coastal Day",
        "location": "Thalpe / Unawatuna",
        "description": "Relaxing day on the palm-fringed beaches of Unawatuna or Thalpe; farewell oceanfront dining."
      },
      {
        "day": "Day 7",
        "title": "Express Highway Transfer",
        "location": "CMB Airport",
        "description": "Southern Expressway transfer directly to CMB Airport for return flight."
      }
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
  }
] as Tour[];

export const DAY_TOURS: Tour[] = [
  {
    "id": "day-tour-yala",
    "title": "Yala National Park Safari",
    "category": "wildlife",
    "type": "day",
    "duration": "Full Day",
    "badge": {
      "text": "Full Day",
      "class": "teal"
    },
    "image": "images/tours/day-tour-yala.jpg",
    "description": "An exclusive private 4x4 safari through Sri Lanka's premier wildlife sanctuary, accompanied by an experienced tracker.",
    "highlights": [
      "Private open-top jeep",
      "Leopard & elephant tracking",
      "Picnic refreshment setup"
    ],
    "startTime": "5:30 AM (Morning) or 2:00 PM (Afternoon)",
    "guests": "Private (1 – 6 Guests)",
    "price": null,
    "pricingType": "bespoke",
    "priceType": "Bespoke Quote",
    "priceDisplay": "Tailor-made"
  },
  {
    "id": "day-tour-sigiriya",
    "title": "Sigiriya Citadel & Dambulla Cave Temples",
    "category": "cultural",
    "type": "day",
    "duration": "Full Day",
    "badge": {
      "text": "Full Day",
      "class": ""
    },
    "image": "images/tours/day-tour-sigiriya.jpg",
    "description": "Ascend the ancient 5th-century Lion Rock fortress and explore the painted cave sanctuaries of Dambulla in a single cultural loop.",
    "highlights": [
      "UNESCO Sigiriya Fortress",
      "Dambulla Cave Murals",
      "Traditional village lunch"
    ],
    "startTime": "7:00 AM",
    "guests": "Private (1 – 8 Guests)",
    "price": null,
    "pricingType": "bespoke",
    "priceType": "Bespoke Quote",
    "priceDisplay": "Tailor-made"
  },
  {
    "id": "day-tour-whale",
    "title": "Mirissa Ocean Whale Expedition",
    "category": "coast",
    "type": "day",
    "duration": "Half Day",
    "badge": {
      "text": "Half Day",
      "class": "teal"
    },
    "image": "images/tours/day-tour-whale.jpg",
    "description": "Set sail at dawn into the deep southern waters to observe migrating blue whales, sperm whales, and spinner dolphins.",
    "highlights": [
      "Blue whale & dolphin sightings",
      "Marine safety equipment",
      "Refreshments at sea"
    ],
    "startTime": "6:00 AM (Seasonal: Nov – Apr)",
    "guests": "2 – 8 Guests",
    "price": null,
    "pricingType": "bespoke",
    "priceType": "Bespoke Quote",
    "priceDisplay": "Tailor-made"
  },
  {
    "id": "day-tour-kandy",
    "title": "Kandy Royal Heritage & Tea Trails",
    "category": "cultural",
    "type": "day",
    "duration": "Full Day",
    "badge": {
      "text": "Full Day",
      "class": ""
    },
    "image": "images/tours/day-tour-kandy.jpg",
    "description": "Experience the sacred rituals of the Temple of the Tooth, wander the Royal Botanic Gardens, and explore a working mountain tea estate.",
    "highlights": [
      "Temple of the Sacred Tooth Relic",
      "Peradeniya Botanic Gardens",
      "Orthodox tea factory tour & tasting"
    ],
    "startTime": "8:00 AM",
    "guests": "Private (1 – 8 Guests)",
    "price": null,
    "pricingType": "bespoke",
    "priceType": "Bespoke Quote",
    "priceDisplay": "Tailor-made"
  },
  {
    "id": "day-tour-galle",
    "title": "Galle Fort & Southern Maritime Heritage",
    "category": "coast",
    "type": "day",
    "duration": "Full Day",
    "badge": {
      "text": "Full Day",
      "class": ""
    },
    "image": "images/tours/day-tour-galle.jpg",
    "description": "Stroll the 17th-century ramparts of this living Dutch citadel, cruise the coastal mangrove lagoons, and visit a sea turtle sanctuary.",
    "highlights": [
      "UNESCO Galle Fort walking tour",
      "Madu Ganga river safari",
      "Marine turtle conservation project"
    ],
    "startTime": "8:30 AM",
    "guests": "Private (1 – 6 Guests)",
    "price": null,
    "pricingType": "bespoke",
    "priceType": "Bespoke Quote",
    "priceDisplay": "Tailor-made"
  },
  {
    "id": "day-tour-tea",
    "title": "Nuwara Eliya Highlands & High Tea",
    "category": "highlands",
    "type": "day",
    "duration": "Full Day",
    "badge": {
      "text": "Full Day",
      "class": "teal"
    },
    "image": "images/tours/day-tour-tea.jpg",
    "description": "Journey into the misty tea country, walk through heritage rolling estates, and experience classic Ceylon high tea.",
    "highlights": [
      "Colonial architecture of 'Little England'",
      "Factory processing masterclass",
      "Fine highland tea tasting"
    ],
    "startTime": "7:30 AM",
    "guests": "Private (1 – 6 Guests)",
    "price": null,
    "pricingType": "bespoke",
    "priceType": "Bespoke Quote",
    "priceDisplay": "Tailor-made"
  }
] as Tour[];

export const DESTINATIONS: Destination[] = [
  {
    "name": "Sigiriya",
    "tagline": "The Ancient Citadel",
    "description": "Ascend the legendary Lion Rock fortress and explore the royal water gardens of this 5th-century architectural marvel.",
    "tags": [
      "History",
      "Photography",
      "Hiking"
    ],
    "region": "Cultural Triangle",
    "imageUrl": "assets/images/destinations/sigiriya.jpg",
    "isActive": true,
    "id": "dest-sigiriya"
  },
  {
    "name": "Anuradhapura",
    "tagline": "Sacred Ancient Wonders",
    "description": "Marvel at towering white stupas, the sacred Sri Maha Bodhi tree, and the sprawling ruins of Sri Lanka's first ancient kingdom.",
    "tags": [
      "Ancient Wonders",
      "Spirituality",
      "UNESCO Heritage"
    ],
    "region": "Cultural Triangle",
    "imageUrl": "assets/images/destinations/anuradhapura.jpg",
    "isActive": true,
    "id": "dest-anuradhapura"
  },
  {
    "name": "Dambulla",
    "tagline": "Golden Cave Temples",
    "description": "Discover centuries-old golden cave temple murals and hundreds of sacred Buddha statues carved directly into the rock face.",
    "tags": [
      "Culture",
      "Spirituality",
      "History"
    ],
    "region": "Cultural Triangle",
    "imageUrl": "assets/images/destinations/dambulla.jpg",
    "isActive": true,
    "id": "dest-dambulla"
  },
  {
    "name": "Ella",
    "tagline": "Emerald Peaks & Valleys",
    "description": "Journey through misty tea plantations, cross the iconic Nine Arches Bridge, and hike to breathtaking viewpoints above the clouds.",
    "tags": [
      "Nature",
      "Hiking",
      "Train Rides"
    ],
    "region": "Hill Country",
    "imageUrl": "assets/images/destinations/ella.jpg",
    "isActive": true,
    "id": "dest-ella"
  },
  {
    "name": "Mirissa",
    "tagline": "Golden Sands & Whales",
    "description": "Watch blue whales breach at sunrise, surf pristine waves, and dine on the freshest seafood at sunset on golden beaches.",
    "tags": [
      "Beach",
      "Whale Watching",
      "Surfing"
    ],
    "region": "South Coast",
    "imageUrl": "assets/images/destinations/mirissa.jpg",
    "isActive": true,
    "id": "dest-mirissa"
  },
  {
    "name": "Galle Fort",
    "tagline": "Colonial Charm",
    "description": "Wander the cobblestone streets of this UNESCO fortress, where Dutch colonial architecture meets Indian Ocean sunsets and boutique galleries.",
    "tags": [
      "History",
      "Shopping",
      "Architecture"
    ],
    "region": "South Coast",
    "imageUrl": "assets/images/destinations/galle.jpg",
    "isActive": true,
    "id": "dest-galle-fort"
  },
  {
    "name": "Yala National Park",
    "tagline": "Untamed Wilderness",
    "description": "Home to the highest density of leopards in the world, alongside elephants, sloth bears, and over 200 bird species in stunning landscapes.",
    "tags": [
      "Wildlife",
      "Photography",
      "Safari"
    ],
    "region": "South East",
    "imageUrl": "assets/images/destinations/yala.jpg",
    "isActive": true,
    "id": "dest-yala-national-park"
  },
  {
    "name": "Kandy",
    "tagline": "Sacred Hill Capital",
    "description": "Home to the Temple of the Tooth Relic and surrounded by lush hills, Kandy is the cultural heart of Sri Lanka — steeped in royal heritage.",
    "tags": [
      "Culture",
      "Temples",
      "Gardens"
    ],
    "region": "Hill Country",
    "imageUrl": "assets/images/destinations/kandy.jpg",
    "isActive": true,
    "id": "dest-kandy"
  },
  {
    "name": "Nuwara Eliya",
    "tagline": "Little England in the Hills",
    "description": "Stroll through emerald tea estates, visit historic colonial factories, and savor Ceylon high tea amidst mist-kissed hills.",
    "tags": [
      "Tea Tasting",
      "Cool Climate",
      "Colonial Heritage"
    ],
    "region": "Hill Country",
    "imageUrl": "assets/images/destinations/nuwara-eliya.jpg",
    "isActive": true,
    "id": "dest-nuwara-eliya"
  }
];
