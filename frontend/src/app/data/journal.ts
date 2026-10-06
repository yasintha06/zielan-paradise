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
      { label: 'The Grand Island Odyssey', link: '/tours/tour-grand-island-odyssey' },
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
        'Blue whales: off Mirissa from roughly November to April; off Trincomalee from roughly March to August.',
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
    related: [{ label: 'See the full Grand Island Odyssey', link: '/tours/tour-grand-island-odyssey' }],
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
];
