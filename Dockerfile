FROM node:24-bookworm-slim AS frontend

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html tsconfig.json vite.config.ts ./
COPY src ./src
RUN npm run build

FROM python:3.12-slim-bookworm

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    SOLICITACOES_WEB_DIR=/app/dist \
    SOLICITACOES_DB=/app/data/solicitacoes.db

COPY api/requirements.txt ./api/requirements.txt
RUN pip install --no-cache-dir -r api/requirements.txt \
    && useradd --system --create-home painel \
    && install -d -o painel -g painel /app/data
COPY api/main.py ./api/main.py
COPY --from=frontend /app/dist ./dist

USER painel
EXPOSE 10000
CMD ["sh", "-c", "exec python -m uvicorn api.main:app --host 0.0.0.0 --port \"${PORT:-10000}\""]
