# Zeilan Paradise: WTM kit

Everything here uses only confirmed facts (the same as the website). To rebuild after changing tours:
`python docs/wtm/make_wtm.py`.

## 1. Files to print or share

| File | What it is | How to print |
|---|---|---|
| `zeilan-agent-factsheet.pdf` | Two-page A4 sheet: all 10 round tours, 8 day tours, how it works, what a quote contains, contact and QR code | A4, double-sided, colour, 150–170 gsm silk. Also on the website at /agents |
| `zeilan-sample-itinerary.pdf` | Classic Ceylon & Coast, day by day, price on request | Share by email or QR; it is also on /agents. Print a few for the table |
| `zeilan-business-card.pdf` | Front (name, phone, email, web) and back (QR to /agents) | 85 × 55 mm card. The file is 91 × 61 mm: it includes 3 mm bleed on every side, tell the printer |
| `qr-agents.png` / `.svg` | QR to zeilanparadise.com/agents (marked as WTM in Google Analytics if you add it) | For a table card or a phone screen |
| `qr-website.png` / `.svg` | QR to the homepage | Spare |

**Before printing:** scan both QR codes with your phone and check they open the right page.

## 2. The 30-second introduction

> "Hello, I'm Yasintha, founder of Zeilan Paradise. We are an inbound Sri Lanka tour business for UK travellers
> and travel agents. We have ten private round tours, from an eight-day first visit to a sixteen-day grand tour,
> and eight day tours. Every journey is private with an English-speaking chauffeur-guide, and we tailor the route,
> hotels and pace to each client. Can I leave you our fact sheet? The QR code takes you to our agent page."

## 3. Questions to ask each agent (write the answers on the back of their card)

1. Do you already sell Sri Lanka? Which months are busiest for you?
2. What kind of clients: couples, families, honeymooners, groups, wildlife, wellness?
3. How long do their trips usually last?
4. How do you like to work with a ground handler: net rates, commission, or a quote per enquiry?
5. Who should I send a sample quote to, and by when?

## 4. Capturing contacts at the stand

- Fastest: open **zeilanparadise.com/agents** on your phone and fill in the agent form with them. It goes
  straight into Admin → Enquiries (filter "Agents") and emails info@zeilanparadise.com.
- Or photograph their business card and add a one-line note: *name · company · what they sell · follow-up date*.

## 5. Follow-up email (send within 3 days)

> **Subject:** Lovely to meet you at WTM: Zeilan Paradise, private Sri Lanka journeys
>
> Dear [Name],
>
> Thank you for stopping by at WTM. As promised, I have attached our agent fact sheet and a sample itinerary
> (Classic Ceylon & Coast, 14 days).
>
> We offer 10 private round tours and 8 day tours, each tailored to your clients' dates, interests and pace.
> If you have a client in mind, send me the dates and group size and I will prepare a quote.
>
> You can also see every tour at zeilanparadise.com/agents.
>
> Kind regards,
> Yasintha Agampodi
> Founder, Zeilan Paradise
> +44 7818 792995 · info@zeilanparadise.com · zeilanparadise.com

## 6. Say only what is true today

Agents will ask. Until these are confirmed, **do not** say or print that you are licensed, SLTDA-registered,
ATOL/ABTA protected, a registered company, or that you offer 24/7 support. Honest answers:

- *"Are you licensed?"* → "Our registration in Sri Lanka is in progress. I can let you know as soon as it is complete."
- *"What commission do you pay?" / "What are your net rates?"* → "I will send you our agent terms after the show."
  (Decide these before WTM if you can, then tell me and I will add them to the website and the fact sheet.)
- *"How quickly do you reply?"* → give only a time you can really keep.

## 7. Facts to confirm (then the website and PDFs update)

| Fact | Where it goes |
|---|---|
| Agent rates policy, commission, reply time | /agents page and fact sheet (`frontend/src/app/config/site.ts`, `AGENTS`) |
| Company incorporated + registration number | About page (`BUSINESS.incorporated`, `registrationNumber`) |
| Founder photo | About page (`BUSINESS.founder.photo`) |
| Sri Lanka office address | About page (`BUSINESS.sriLankaOffice`) |
| Customer-money protection in place | FAQ (`MONEY_PROTECTION_CONFIRMED` in `pages/faq/faq.ts`) |
