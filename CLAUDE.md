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
  `backend/catalog_data.py`, `frontend/public/sitemap.xml`). New items reach the live DB via
  Admin → Overview → "Import missing catalogue items".

## Where things are
- Contact details: `frontend/src/app/config/site.ts` (phone +44 7818 792995, info@zeilanparadise.com).
- Routes: `frontend/src/app/app.routes.ts`; SEO + JSON-LD: `services/seo.service.ts`.
- Homepage hero film: `pages/home/home.ts` (`HERO_FILM`), clips in `frontend/public/video/` (`{name}-1080.mp4`,
  `{name}-720.mp4`, `{name}.webp`; compress with FFmpeg, ~2 MB per clip). Falls back to photos for reduced motion/data-saver.
- Tours without a photo get a library fallback via `utils/image.ts` (`imageUrl(src, size, tourId)`).
- Admin costing calculator: `pages/admin/quotes/quote-model.ts` (ATFL course method; spec reproduces course workbooks).
- FAQ answers (`pages/faq/faq.ts`) must stay consistent with the Terms page.

## Business context
UK-facing, premium, private tailor-made Sri Lanka tours. Business planning happens in a separate chat;
see `D:\Zeilan Paradise (PVT) LTD\BUSINESS BRIEF - paste into new chat.md` only if needed.
