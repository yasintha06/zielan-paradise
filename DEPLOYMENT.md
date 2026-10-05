# Deploying Zeilan Paradise (Azure + MongoDB Atlas)

```
Visitor ──► Azure Static Web Apps (Angular site)  zeilanparadise.com
               │  calls
               ▼
            Azure App Service (Flask API)          api.zeilanparadise.com
               │
               ▼
            MongoDB Atlas (database)
```

Both apps deploy automatically from GitHub Actions when you push to `main`:

| Workflow | Triggers on | Deploys |
|---|---|---|
| `.github/workflows/azure-static-web-apps.yml` | changes in `frontend/` | Angular site → Static Web Apps |
| `.github/workflows/main_zeilan-backend.yml` | changes in `backend/` | Flask API → App Service `zeilan-backend` |

---

## 1. MongoDB Atlas (database)

1. Sign in at <https://cloud.mongodb.com> → **Create** a cluster.
   - **M0 (Free)** is fine to launch with. Pick a region close to your App Service (e.g. *Azure / UK South* or *Azure / West Europe*).
2. **Database Access** → *Add New Database User*
   - Authentication: password. Username e.g. `zeilan-api`. Generate a strong password and keep it safe.
   - Role: *Read and write to any database*.
3. **Network Access** → *Add IP Address*
   - Simplest: `0.0.0.0/0` (allow from anywhere; the password still protects it).
   - Stricter: add each **Outbound IP address** of your App Service (App Service → *Networking* → *Outbound addresses*).
4. **Connect** → *Drivers* → copy the connection string. It looks like:
   ```
   mongodb+srv://zeilan-api:<password>@cluster0.xxxxx.mongodb.net/zeilanparadise?retryWrites=true&w=majority
   ```
   Replace `<password>` with the real one. If the password contains `@ : / ? #` characters, URL-encode them.

On first start against an empty database, the API fills `tours` and `destinations` with the catalogue from
`backend/fallback_data.py` (the same tours and itineraries as `data/*.json`). Testimonials are never seeded:
add only genuine reviews. Enquiries go into the `inquiries` collection.

---

## 2. Azure App Service (Flask API)

1. Azure Portal → **Create a resource** → **Web App**
   - Name: `zeilan-backend` (must match `app-name` in the backend workflow)
   - Publish: *Code* · Runtime stack: **Python 3.12** · OS: **Linux**
   - Region: same as Atlas (e.g. UK South)
   - Pricing: **B1** is the minimum we recommend (Free F1 sleeps and is slow to wake).
2. **Settings → Environment variables** → add:

   | Name | Value |
   |---|---|
   | `FLASK_ENV` | `production` |
   | `MONGO_URI` | your Atlas connection string |
   | `JWT_SECRET_KEY` | a long random string (e.g. `python -c "import secrets;print(secrets.token_hex(32))"`) |
   | `ADMIN_USERNAME` | your admin login name |
   | `ADMIN_PASSWORD` | a strong admin password |
   | `ALLOWED_ORIGINS` | `https://zeilanparadise.com,https://www.zeilanparadise.com,https://<your-swa>.azurestaticapps.net` |
   | `SCM_DO_BUILD_DURING_DEPLOYMENT` | `true` (installs `requirements.txt` on deploy) |
   | `ADMIN_NOTIFICATION_EMAIL` | where new-enquiry emails should go |
   | `SMTP_HOST` / `SMTP_PORT` | e.g. `smtp.gmail.com` / `587` |
   | `SMTP_USER` / `SMTP_PASS` | the sending mailbox and its password (for Gmail, an [App Password](https://myaccount.google.com/apppasswords)) |
   | `EMAIL_FROM` | optional display sender, e.g. `Zeilan Paradise <hello@zeilanparadise.com>` |

   The API refuses to start in production if `MONGO_URI`, `JWT_SECRET_KEY` or `ADMIN_PASSWORD` is missing.
   Every enquiry is saved to MongoDB **and** emailed to you (if SMTP is set). If the database is unreachable and
   email isn't configured, the API rejects the enquiry and the website offers the visitor WhatsApp/email instead,
   so no lead is silently lost.
3. **Settings → Configuration → General settings → Startup Command**:
   ```
   gunicorn --bind=0.0.0.0 --timeout 600 "app:create_app()"
   ```
   Turn **Always On** on (B1 or higher) so the first visitor isn't kept waiting.
4. **Overview → Download publish profile**. In GitHub: *Settings → Secrets and variables → Actions → New repository secret*
   - Name `AZUREAPPSERVICE_PUBLISHPROFILE`, value = entire contents of that file.
5. Push a change in `backend/` (or run the workflow manually from the *Actions* tab). Then check
   `https://zeilan-backend.azurewebsites.net/api/health` → `{"status": "healthy"}`.

---

## 3. Azure Static Web Apps (website)

1. Azure Portal → **Create a resource** → **Static Web App**
   - Plan: **Free** is enough to start (Standard adds SLA and more custom domains).
   - Deployment source: **Other** (the workflow in this repo does the deploying).
2. Open the new Static Web App → **Manage deployment token** → copy it.
   In GitHub add secret `AZURE_STATIC_WEB_APPS_API_TOKEN` with that value.
3. Push a change in `frontend/` (or run the workflow manually). The site appears at
   `https://<random-name>.azurestaticapps.net`.

The production build calls the API at `https://api.zeilanparadise.com/api`
(`frontend/src/environments/environment.prod.ts`). Until the custom domain below is set up,
you can temporarily change that to `https://zeilan-backend.azurewebsites.net/api`.

---

## 4. Custom domains (zeilanparadise.com)

At your domain registrar's DNS settings:

| Host | Type | Points to | Then in Azure |
|---|---|---|---|
| `www` | CNAME | `<random-name>.azurestaticapps.net` | Static Web App → *Custom domains* → add `www.zeilanparadise.com` |
| `@` (root) | ALIAS/ANAME, or TXT validation | as shown by Azure | Static Web App → *Custom domains* → add `zeilanparadise.com` |
| `api` | CNAME | `zeilan-backend.azurewebsites.net` | App Service → *Custom domains* → add `api.zeilanparadise.com`, then *Add binding* with a free **App Service Managed Certificate** |

Azure issues the HTTPS certificates for the site automatically.

---

## 5. Go-live checklist

- [ ] `https://api.zeilanparadise.com/api/health` returns healthy
- [ ] Home page shows tours from the database (not just the built-in fallback)
- [ ] Contact / tailor-made form submits and the enquiry appears in the admin dashboard
- [ ] Admin login works with the production password (the default one is never used in production)
- [ ] Contact details in `frontend/src/app/config/site.ts` are correct
- [ ] Browser console on the live site shows no CORS errors (if it does, fix `ALLOWED_ORIGINS`)
