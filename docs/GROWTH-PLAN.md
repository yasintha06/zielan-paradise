# Zeilan Paradise: plan to win clients

Written 12 November 2026. Practical steps in priority order. Nothing here needs a programmer unless it
says "ask Claude". Figures such as commissions change, so check each provider's current terms.

## Week 1: follow up WTM and get found (free)

1. **WTM follow-ups.** Email every agent you met within the week (template in `docs/wtm/WTM-kit.md`).
   Attach the fact sheet and sample itinerary. Log each one in a simple sheet: name, company, what they sell,
   date emailed, reply, next step. Follow up once more after 7 days, then once after 3 weeks.
2. **Google Search Console** (search.google.com/search-console). Add `www.zeilanparadise.com`, verify it, and
   submit `https://www.zeilanparadise.com/sitemap.xml`. This is how Google learns your pages exist, and it
   shows which searches bring people. Ask Claude to add the verification code to the site.
3. **Google Business Profile** (business.google.com). Creates your panel in Google Search and Maps and is
   where UK clients will leave Google reviews. Use the same name, phone and email as the website.
4. **Claim your names**: Instagram, Facebook page, LinkedIn page, TripAdvisor listing. Use the same logo and
   wording everywhere. Send Claude the links to add to the website footer.
5. **Email reputation.** Your SPF and DMARC records exist. Turn on **DKIM** in Namecheap Private Email
   (it gives you one DNS record to add). Without it, quotes sent to agents are more likely to land in spam.

## Month 1: make the site convert

6. **Decide agent terms** (commission or net rates, reply time). Agents asked at WTM; the site hides these
   until you confirm them. One message to Claude adds them to /agents and the fact sheet.
7. **Reply fast.** Aim to answer every enquiry the same day, with a first idea and two or three questions.
   Speed wins more tailor-made bookings than price.
8. **First reviews.** After every trip (even friends-and-family test trips at cost), ask for a Google review
   and permission to quote it. Real reviews go in Admin → Reviews. Never use invented ones.
9. **Real photos and one short video per trip.** Your own material beats stock and can be reused on
   Instagram, the website and proposals.
10. **Costed "from" prices.** When hotel rates arrive, cost each tour in Admin → Costing & quotes and show a
    "from £…" price. Many UK travellers won't enquire without a rough price.

## Months 2 to 3: steady sources of enquiries

11. **UK agents (B2B).** Small Sri Lanka and Asia specialists are your best targets (your research sheet
    lists them). One personal email each, with one tour that suits their clients. Ten good emails a week.
12. **Journal articles for Google.** One helpful article every two weeks answering what UK travellers search:
    "Sri Lanka in August", "Sri Lanka honeymoon itinerary", "Is Sri Lanka good for families", "Pekoe Trail
    guide". Ask Claude to draft from your tour plan; you check the facts.
13. **Instagram.** Three posts a week: one place, one practical tip, one behind-the-scenes. Link in bio to
    the journey planner.
14. **Day-tour marketplaces** (Viator, GetYourGuide, TripAdvisor Experiences). They bring volume for the 8 day
    tours but take a commission and usually need your business registration and insurance. Do this after
    registration.
15. **Partnerships.** UK honeymoon and wedding planners, yoga and wellness teachers who run retreats,
    walking clubs. Offer them a ready-made tour (Honeymoon, Ayurveda, Pekoe Trail) for their audience.

## Must be in place before taking real bookings

- Company registration, SLTDA registration, business bank account.
- UK side: advice on the Package Travel Regulations and customer-money protection; liability insurance.
- Booking terms checked by an adviser (the Terms page mentions financial protection).
- A database backup routine: run the `mongodump` backup monthly (free Atlas has no automatic backups).

## What to measure each month

Enquiries received · replies within 24 hours · proposals sent · bookings · where each enquiry came from
(ask every client "how did you find us?"). Admin → Enquiries already tracks status and notes.
