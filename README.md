# Zeilan Paradise: B2B Tourism Platform for Sri Lanka

**Live site:** [zeilanparadise.com](https://zeilanparadise.com)

Zeilan Paradise is a B2B inbound tourism business for Sri Lanka. This repository holds its full website and admin system: partners browse tours and destinations and send enquiries, and the admin dashboard manages the catalogue, enquiries, quotes and testimonials.


## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Angular 22 (TypeScript) |
| Backend | Python 3.12, Flask REST API, Flask-JWT-Extended, bcrypt |
| Database | MongoDB Atlas |
| Hosting | Azure App Service (Linux): one service serves the Angular site and the `/api` |
| CI/CD | GitHub Actions: builds the Angular app and deploys on every push to `main` |

## Architecture

```
Visitor ──► Azure App Service ──┬─ /       Angular website
                                └─ /api/*  Flask API ──► MongoDB Atlas
```

## Features
- Public catalogue of tours and destinations, served from a REST API
- Enquiry and quote-request forms with email notifications
- Secure admin area (JWT login) to manage tours, destinations, enquiries, quotes and testimonials
- Automated tests for the API (`backend/tests`)

## Run locally
```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env   # fill in your own values
python app.py

# Frontend (in a second terminal)
cd frontend
npm install
npm start
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for the Azure and MongoDB Atlas setup.

## What I learned
- Deploying a full-stack app to Azure App Service and automating it with GitHub Actions
- Working within real cloud constraints (region policies, networking between Azure and MongoDB Atlas)
- Designing a REST API with separate public and admin routes and JWT authentication

---
Built by [Yasintha Agampodi](https://www.linkedin.com/in/yasintha-agampodi-a416a1325)
