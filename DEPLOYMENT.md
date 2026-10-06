# Deploying Zeilan Paradise (Azure App Service + MongoDB Atlas)

```
Visitor ──► Azure App Service "zeilan-backend"   zeilanparadise.com
              ├─ /            Angular website (built into backend/static at deploy time)
              └─ /api/...     Flask API
                    │
                    ▼
              MongoDB Atlas (database)
```

One App Service hosts both the website and the API, so they share a domain and need no
cross-site (CORS) setup. (Azure Static Web Apps isn't used: the subscription's region
policy blocks every region it supports.)

Deploys are automatic: `.github/workflows/main_zeilan-backend.yml` runs on every push to
`main` that touches `frontend/` or `backend/`. It builds the Angular site, copies it into
`backend/static/`, pre-compresses it, and deploys the `backend` folder to the App Service.

---

## 1. MongoDB Atlas (database)

The existing cluster `zeilanparadise.6lrgwk0.mongodb.net` is used; database `zeilanparadise`.

- **Network Access** must include `0.0.0.0/0` (or the App Service's outbound IPs, found under
  App Service → *Networking* → *Outbound addresses*), or Azure can't connect.
- The connection string (`MONGO_URI`) is the one in `backend/.env`. Keep it out of Git.

On first start against an empty database, the API fills `tours` and `destinations` with the
catalogue from `backend/fallback_data.py`. Testimonials are never seeded: add only genuine reviews.
Enquiries go into the `inquiries` collection.

---

## 2. Azure App Service

Created as **zeilan-backend** · Python 3.12 · Linux · region allowed by the subscription (Spain Central).

**Settings → Environment variables**

| Name | Value |
|---|---|
| `FLASK_ENV` | `production` |
| `MONGO_URI` | Atlas connection string |
| `JWT_SECRET_KEY` | long random string |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | admin login for `/admin/login` |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | `true` (installs `requirements.txt` on deploy) |
| `ADMIN_NOTIFICATION_EMAIL` | where new-enquiry emails go (optional) |
| `SMTP_HOST` / `SMTP_PORT` | e.g. `smtp.gmail.com` / `587` (optional) |
| `SMTP_USER` / `SMTP_PASS` | sending mailbox + password; for Gmail an [App Password](https://myaccount.google.com/apppasswords) (optional) |
| `EMAIL_FROM` | display sender, e.g. `Zeilan Paradise <hello@zeilanparadise.com>` (optional) |

`ALLOWED_ORIGINS` is not needed: the site and API share an origin.
The API refuses to start in production if `MONGO_URI`, `JWT_SECRET_KEY` or `ADMIN_PASSWORD` is missing.
Every enquiry is saved to MongoDB and emailed (if SMTP is set). If neither is available the API
rejects it and the website offers the visitor WhatsApp/email instead, so no lead is silently lost.

**Settings → Configuration → General settings**
- Startup Command: `gunicorn --bind=0.0.0.0 --timeout 600 "app:create_app()"`
- SCM Basic Auth Publishing Credentials: **On** (needed for the publish profile)
- Always On: **On** (B1 plan or higher)

**GitHub secret:** App Service → *Overview* → *Download publish profile*; in GitHub →
*Settings → Secrets and variables → Actions*, add `AZUREAPPSERVICE_PUBLISHPROFILE` with the file's contents.

---

## 3. Deploy

```bash
git push origin main
```

Watch GitHub → *Actions*. When it's green:
- `https://zeilan-backend.azurewebsites.net/` shows the website
- `https://zeilan-backend.azurewebsites.net/api/health` returns `{"status": "healthy"}`

---

## 4. Custom domain (zeilanparadise.com)

Custom domains need the **Basic (B1)** plan or higher; the Free F1 plan doesn't support them.

App Service → *Custom domains* → *Add custom domain*, once for `zeilanparadise.com` and once for
`www.zeilanparadise.com`. Azure shows the exact DNS records to add at your registrar, typically:

| Type | Host | Value |
|---|---|---|
| A | `@` | the App Service IP address Azure shows |
| TXT | `asuid` | the verification ID Azure shows |
| CNAME | `www` | `zeilan-backend.azurewebsites.net` |
| TXT | `asuid.www` | the verification ID Azure shows |

Then *Add binding* for each with a free **App Service Managed Certificate** for HTTPS.
The old `api.zeilanparadise.com` subdomain is no longer needed.

---

## 5. Go-live checklist

- [ ] `/api/health` returns healthy on the live domain
- [ ] Tours load on Round Tours / Day Tours (not only the built-in fallback; check `/api/tours`)
- [ ] Contact and tailor-made forms submit and appear in the admin dashboard / your inbox
- [ ] Admin login works with the production password
- [ ] Contact details in `frontend/src/app/config/site.ts` are correct
