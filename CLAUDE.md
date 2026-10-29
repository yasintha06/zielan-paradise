# Zeilan Paradise website

Owner is not a programmer (site built with AI help): explain changes in plain English, test before pushing,
and ask before changing business claims (prices, licences, guarantees, terms).

## Stack
- `frontend/`: Angular 22 standalone components + signals, GSAP/Lenis animation. State set in HTTP
  callbacks must use signals (plain fields don't re-render in this app).
- `backend/`: Flask API, MongoDB Atlas, JWT admin auth; WhiteNoise serves the built site from `backend/static`.
- Hosting: Azure App Service `zeilan-backend` (Spain Central). Secrets live only in Azure environment
  variables (JWT_SECRET_KEY, ADMIN_PASSWORD, MONGO_URI, SMTP_*); never in code or chat.
- Deploy: push to `main` → GitHub Actions runs tests, builds, deploys (~3 min, then 1–2 min to go live).

## Commands
- Frontend tests: `cd frontend && npx ng test --watch=false` · build: `npx ng build`
- Backend tests: `cd backend && venv/Scripts/python -m pytest -q` (mongomock; never test against the live DB)
- Catalogue: edit `data/*.json`, then `python data/build_catalog.py` (regenerates `frontend/src/app/data/catalog.ts`,
  `backend/catalog_data.py`, `frontend/public/sitemap.xml`). They reach the live DB via
  Admin → Overview → "Update catalogue": adds new ids, replaces copies with an older `CATALOG_REV`
  (bump it in `build_catalog.py` when content is rewritten), hides ids in `data/retired.json` (never deletes).
- Photos: originals go in `media-originals/` (git-ignored, never in `frontend/public`); web copies are
  `frontend/public/img/{name}-900.webp` and `-2000.webp` (FFmpeg, libwebp q74), referenced as `images/tours/{name}.jpg`.
  Use the names from the sister's sheet "04 Missing Photos – Handover to Sister" (Google Drive). Check a stock
  photo's real location before using it (two Pexels photos turned out to be Indonesia/Vietnam).
- WTM / print kit: `python docs/wtm/make_wtm.py` builds the agent fact sheet, sample itinerary and business card
  PDFs from `data/*.json` (Edge headless) and copies the PDFs to `frontend/public/files/` (download buttons on /agents).

## Where things are
- Contact details: `frontend/src/app/config/site.ts` (phone +44 7818 792995, info@zeilanparadise.com).
- Routes: `frontend/src/app/app.routes.ts`; SEO + JSON-LD: `services/seo.service.ts`.
- Homepage hero film: `pages/home/home.ts` (`HERO_FILM`), clips in `frontend/public/video/` (`{name}-1080.mp4`,
  `{name}-720.mp4`, `{name}.webp`; compress with FFmpeg, ~2 MB per clip). Falls back to photos for reduced motion/data-saver.
- Tours without a photo get a library fallback via `utils/image.ts` (`imageUrl(src, size, tourId)`).
- Admin costing calculator: `pages/admin/quotes/quote-model.ts` (ATFL course method; spec reproduces course workbooks).
- FAQ answers (`pages/faq/faq.ts`) must stay consistent with the Terms page.
- Unconfirmed facts are empty settings in `config/site.ts` (`BUSINESS`, `AGENTS`) and stay hidden until filled:
  company (`incorporated`), registration number, founder photo, Sri Lanka office, agent rates/commission/reply time.
  The money-protection FAQ is hidden by `MONEY_PROTECTION_CONFIRMED`. Never claim licensed/certified guides,
  24/7 support, "our own team", ATOL/ABTA/SLTDA or reviews until the owner confirms them.
- Enquiries (`backend/routes/enquiries.py`): kinds contact/planner/agent; all email ADMIN_NOTIFICATION_EMAIL
  (default info@); agents also get a plain confirmation (capped 3/hour per address and IP). Honeypot field `website`.
- Background video loops: `components/bg-video` (poster first, lazy, pauses off screen); page banners take
  `[video]` on `app-page-hero`. Tour banners use the film's still (`video/{name}.webp`).

## Business context
UK-facing, premium, private tailor-made Sri Lanka tours. Business planning happens in a separate chat;
see `D:\Zeilan Paradise (PVT) LTD\BUSINESS BRIEF - paste into new chat.md` only if needed.
