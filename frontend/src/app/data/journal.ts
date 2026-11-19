/**
 * Journal articles. Each body is a list of blocks so pages stay consistent and easy to edit.
 * Keep facts general and evergreen; anything that changes (visa rules, prices) links to official sources.
 */
export type Block =
  | { h: string }
  | { p: string }
  | { list: string[] }
  | { table: { head: string[]; rows: string[][] } }
  | { tip: string };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readMinutes: number;
  updated: string;
  related?: { label: string; link: string }[];
  body: Block[];
}

export const ARTICLES: Article[] = [
  {
    slug: 'best-time-to-visit-sri-lanka',
    title: 'The best time to visit Sri Lanka, month by month',
    excerpt: 'Two monsoons, two coasts, one simple rule: there is always somewhere wonderful to be. Here is how to choose.',
    image: 'tour-southern-coast',
    category: 'Planning',
    readMinutes: 6,
    updated: '2026-10-01',
    related: [
      { label: 'East Coast Summer Escape', link: '/tours/tour-east-coast-summer' },
      { label: 'Classic Ceylon & Coast', link: '/tours/tour-classic-ceylon-coast' },
    ],
    body: [
      { p: 'Sri Lanka has two monsoons that arrive at different times on different coasts. That sounds complicated, but it is actually good news: whatever month you travel, part of the island is in its best season.' },
      { h: 'The simple rule' },
      { list: [
        'December to April: best for the south and west coasts, the hill country and the Cultural Triangle. This is the classic season and the busiest.',
        'May to September: best for the east coast (Trincomalee, Pasikudah, Arugam Bay) and still good in the Cultural Triangle. The south-west monsoon brings rain to the south and west.',
        'October and November: the changeover months, with showers across the island. Fewer visitors and greener landscapes; good value if you are flexible.',
      ] },
      { h: 'Month by month' },
      { table: {
        head: ['When', 'Best for', 'Worth knowing'],
        rows: [
          ['Dec – Feb', 'South & west beaches, hill country, Cultural Triangle', 'Peak season; book stays early, especially over Christmas and New Year.'],
          ['Mar – Apr', 'South & west coasts, wildlife', 'Hot and clear. Whale watching off Mirissa is still good. Sinhala & Tamil New Year in mid-April.'],
          ['May – Jun', 'East coast, Cultural Triangle', 'The south-west monsoon arrives. The east coast opens up for the summer.'],
          ['Jul – Aug', 'East coast, Cultural Triangle, Kandy', 'UK school holidays. Kandy’s Esala Perahera festival usually falls in July or August.'],
          ['Sep', 'East coast, elephant gatherings', 'Minneriya and Kaudulla are at their best in the dry season. Yala often closes for several weeks around September – October.'],
          ['Oct – Nov', 'Flexible travellers', 'Inter-monsoon showers island-wide. Quieter, greener and good value.'],
        ],
      } },
      { h: 'Wildlife timing' },
      { list: [
        'Blue whales: off Mirissa from December to April; off Trincomalee from roughly March to August.',
        'Elephant gathering: Minneriya and Kaudulla in the dry season, usually July to October.',
        'Leopards: Yala and Wilpattu are good much of the year; check Yala’s annual closure if you travel in September or October.',
      ] },
      { tip: 'Travelling in July or August? Pair the Cultural Triangle and Kandy with an east-coast finish instead of the south. You get sunshine and calm seas while the south-west has its monsoon.' },
    ],
  },
  {
    slug: 'two-weeks-in-sri-lanka',
    title: 'Two weeks in Sri Lanka: a perfect first route',
    excerpt: 'Ancient cities, tea country, leopards and the sea, in one unhurried loop with no backtracking.',
    image: 'ella',
    category: 'Itineraries',
    readMinutes: 5,
    updated: '2026-10-01',
    related: [{ label: 'See the full Classic Ceylon & Coast', link: '/tours/tour-classic-ceylon-coast' }],
    body: [
      { p: 'Fourteen days is the sweet spot for a first visit. It lets you see the island’s four great themes (history, tea country, wildlife and the coast) without long drives every day.' },
      { h: 'The route at a glance' },
      { table: {
        head: ['Nights', 'Where', 'Why'],
        rows: [
          ['1', 'Negombo', 'Rest after the flight, close to the airport.'],
          ['3', 'Sigiriya', 'Lion Rock, Dambulla’s cave temples, Polonnaruwa and an elephant safari.'],
          ['2', 'Kandy', 'The Temple of the Tooth, the botanic gardens and the hill capital’s markets.'],
          ['2', 'Tea country', 'A planter’s bungalow, tea tasting and Horton Plains.'],
          ['1', 'Ella', 'The famous train ride and the views from Little Adam’s Peak.'],
          ['1', 'Yala', 'Leopard safaris at dawn and dusk.'],
          ['3', 'South coast & Galle', 'Galle Fort, quiet beaches and, in season, whales.'],
        ],
      } },
      { h: 'Why this order works' },
      { list: [
        'A short first day: long-haul flights often land early, so you rest by the sea before any long drive.',
        'No backtracking: the loop flows north, then into the hills, then down to the south coast and back to the airport on the expressway.',
        'Early starts where they matter: Sigiriya and the safaris are best at first light, before the heat.',
        'A slow finish: three nights on the coast at the end means you go home rested.',
      ] },
      { tip: 'Every day can be reshaped. Some travellers swap Yala for an extra night in tea country, or add Trincomalee in the summer months.' },
    ],
  },
  {
    slug: 'sri-lanka-travel-tips-uk',
    title: 'Before you go: Sri Lanka tips for UK travellers',
    excerpt: 'Flights, money, plugs, temple etiquette and the small things that make a big difference.',
    image: 'kandy',
    category: 'Practical',
    readMinutes: 5,
    updated: '2026-10-01',
    body: [
      { h: 'Getting there' },
      { p: 'There are direct flights from London to Colombo of around eleven hours, and many good one-stop routes through the Gulf. Most flights from the UK arrive early in the morning, which is why we plan a gentle first day.' },
      { h: 'Entry requirements' },
      { p: 'Entry rules for UK passport holders can change. Before you book, check the latest requirements on the official Sri Lanka ETA website and the UK Foreign Office travel advice for Sri Lanka. Your passport should be valid for at least six months from arrival.' },
      { h: 'Money' },
      { list: [
        'The currency is the Sri Lankan rupee (LKR). Cards are accepted in most hotels and larger restaurants.',
        'Carry some cash for markets, small cafés, tips and temple donations. ATMs are common in towns.',
        'Tipping is customary: for your chauffeur-guide, hotel staff and safari trackers. We will give you a simple guide.',
      ] },
      { h: 'Time, power and phones' },
      { list: [
        'Sri Lanka is 5½ hours ahead of GMT (4½ hours ahead during British Summer Time).',
        'Sockets are mostly types D and G. UK plugs often fit, but bring a universal adapter.',
        'Local SIM and eSIM data plans are inexpensive; mobile coverage is good in most areas.',
      ] },
      { h: 'Visiting temples' },
      { list: [
        'Cover shoulders and knees, and remove shoes and hats before entering.',
        'Never pose with your back to a Buddha statue, and don’t point your feet towards it.',
        'A light scarf or sarong in your day bag makes every visit easy.',
      ] },
      { h: 'Health & insurance' },
      { p: 'Speak to your GP or a travel clinic about vaccinations several weeks before you go, and see the NHS Fit for Travel website. Comprehensive travel insurance is essential and is a condition of booking with us.' },
      { tip: 'Pack light, breathable clothes, a warm layer for the hill country (it can be cool in the evenings), good walking shoes and strong insect repellent.' },
    ],
  },
  {
    slug: 'ten-days-in-sri-lanka',
    title: '10 days in Sri Lanka: an easy first route',
    excerpt: 'Sigiriya, Kandy, tea country, Ella and the south coast in ten unhurried days, with the drives kept short.',
    image: 'tour-cultural-triangle',
    category: 'Itineraries',
    readMinutes: 6,
    updated: '2026-11-19',
    related: [
      { label: 'Sri Lanka Highlights (8 days)', link: '/tours/tour-sri-lanka-highlights' },
      { label: 'Honeymoon: Tea Hills & Southern Beaches (11 days)', link: '/tours/tour-honeymoon-tea-hills-beaches' },
    ],
    body: [
      { p: 'Ten days is enough to see the best of Sri Lanka without rushing: an ancient rock fortress, a sacred city, misty tea hills, a famous train ride and a few days by the sea. The trick is to choose one area per stage and to keep most drives under four hours.' },
      { h: 'The route at a glance' },
      { table: {
        head: ['Nights', 'Where', 'What you do'],
        rows: [
          ['1', 'Negombo', 'Rest by the sea after the overnight flight, 20 minutes from the airport.'],
          ['2', 'Sigiriya', 'Climb Lion Rock early, visit the Dambulla cave temples and take a jeep safari to see wild elephants.'],
          ['2', 'Kandy', 'The Temple of the Tooth, the Royal Botanic Gardens at Peradeniya and a Kandyan dance show.'],
          ['1', 'Nuwara Eliya', 'A working tea factory and tea tasting in the cool hill country.'],
          ['1', 'Ella', 'The train through the tea hills, the Nine Arches Bridge and the walk up Little Adam’s Peak.'],
          ['2', 'South coast', 'Galle Fort, quiet beaches and, from December to April, whale watching from Mirissa.'],
        ],
      } },
      { h: 'Day by day' },
      { list: [
        'Day 1: Land in Colombo and rest in Negombo.',
        'Day 2: Drive to Sigiriya (about 4 hours). Afternoon at the hotel or a village walk.',
        'Day 3: Sigiriya at sunrise, Dambulla cave temples, then an afternoon elephant safari in Minneriya or Kaudulla.',
        'Day 4: To Kandy (about 3 hours), with a stop at a spice garden. Evening dance show.',
        'Day 5: Temple of the Tooth in the morning and the botanic gardens in the afternoon.',
        'Day 6: Into the hills to Nuwara Eliya, visiting a tea factory on the way.',
        'Day 7: The scenic train to Ella (your driver meets you at the station). Afternoon at the Nine Arches Bridge.',
        'Day 8: Little Adam’s Peak at sunrise, then down to the south coast (about 4 to 5 hours).',
        'Day 9: Galle Fort and a free afternoon on the beach.',
        'Day 10: The expressway back to the airport (about 2 hours from Galle).',
      ] },
      { h: 'Good to know' },
      { list: [
        'The train from Nanu Oya or Kandy to Ella is popular and reserved seats sell out early, so book well ahead. If there are no seats, your driver takes you by road and the views are still beautiful.',
        'The best season for this route is December to April. From May to September, swap the south coast for the east coast (Trincomalee or Pasikudah) for calmer seas.',
        'Short on time? Drop Nuwara Eliya and go straight from Kandy to Ella. Want wildlife? Swap one beach night for a night near Yala or Udawalawe.',
      ] },
      { tip: 'Every stage of this route can be changed. Tell us your dates and what you love, and we will send you a day-by-day plan with the price for your travel dates.' },
    ],
  },
  {
    slug: 'sri-lanka-with-children',
    title: 'Sri Lanka with children: a family guide',
    excerpt: 'Elephants, beaches, trains and tuk-tuks: how to plan a relaxed Sri Lanka holiday the whole family will love.',
    image: 'family-safari-elephants-01',
    category: 'Planning',
    readMinutes: 6,
    updated: '2026-11-19',
    related: [
      { label: 'Summer Family Adventure (15 days)', link: '/tours/tour-summer-family-adventure' },
      { label: 'The best time to visit Sri Lanka', link: '/journal/best-time-to-visit-sri-lanka' },
    ],
    body: [
      { p: 'Sri Lanka is a wonderful family destination. Distances are short, Sri Lankans are famously warm towards children, and in one trip you can see wild elephants, ride a train through the tea hills and spend lazy days on the beach. A little planning makes it easy.' },
      { h: 'What children love most' },
      { list: [
        'Jeep safaris to see wild elephants, especially at Udawalawe and Minneriya.',
        'The train through the tea hills to Ella, and the Nine Arches Bridge.',
        'A turtle hatchery on the south coast and boat trips on the lagoons.',
        'Beginner surf lessons on gentle beaches, and a cooking class with a local family.',
        'Climbing Sigiriya rock (best for children who are happy with many steps).',
      ] },
      { h: 'When to go with children' },
      { p: 'UK school holidays in July and August fall in the best season for the east coast and the Cultural Triangle, so a summer family trip usually ends on the east coast, where the sea is calmer. At Christmas, Easter and February half-term, the south and west coasts are at their best.' },
      { h: 'Pace and planning' },
      { list: [
        'Stay two or three nights in each place so children have time to swim and rest.',
        'Keep most drives under three or four hours, and break long ones with a stop for lunch or a swim.',
        'A private car with your own chauffeur-guide means you can stop whenever you need to.',
        'Choose hotels with a pool and family rooms or interconnecting rooms.',
        'Child car seats are not always standard in Sri Lanka. Tell us your children’s ages and we will ask in advance.',
      ] },
      { h: 'Health, food and the sun' },
      { list: [
        'Ask your GP or a travel clinic about vaccinations several weeks before you go, and see the NHS Fit for Travel website.',
        'The sun is strong: pack high-factor sun cream, hats and swim tops, and plan outdoor visits for the morning.',
        'Use insect repellent suitable for children, especially at dawn and dusk.',
        'Drink bottled water. Most hotels make milder dishes, and rice, noodles, fruit and pancakes are easy to find.',
      ] },
      { tip: 'Travelling with young children? Tell us their ages and interests when you enquire, and we will shape the route, the drive times and the hotels around them.' },
    ],
  },
];
