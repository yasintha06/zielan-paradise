# Zeilan Paradise: website + API in one container (used by Render; works on any Docker host).
# Stage 1 builds the Angular website.
FROM node:22-slim AS web
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

# Stage 2 runs the Flask API and serves the built website from backend/static.
FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 FLASK_ENV=production PORT=10000
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt brotli
COPY backend/ ./
RUN rm -rf static .env
COPY --from=web /app/frontend/dist/frontend/browser ./static
RUN python -m whitenoise.compress static
EXPOSE 10000
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT} --workers 2 --timeout 120 'app:create_app()'"]
