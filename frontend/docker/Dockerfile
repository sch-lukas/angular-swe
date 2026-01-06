# =============================================================================
# Stage 1: Build (vom Projekt-Root aus bauen!)
# =============================================================================
FROM node:22-alpine AS build

# pnpm installieren
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Workspace-Dateien vom Root kopieren
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY frontend/package.json ./frontend/

# Dependencies nur für Frontend installieren
RUN pnpm install --frozen-lockfile --filter frontend

# Frontend-Quellcode kopieren und bauen
COPY frontend/ ./frontend/
WORKDIR /app/frontend
RUN node ../node_modules/.pnpm/node_modules/@angular/cli/bin/ng.js build

# =============================================================================
# Stage 2: Production mit nginx
# =============================================================================
FROM nginx:alpine AS production

# Eigene nginx-Konfiguration kopieren
COPY frontend/docker/nginx.conf /etc/nginx/nginx.conf

# Build-Artefakte vom Build-Stage kopieren
COPY --from=build /app/frontend/dist/frontend /usr/share/nginx/html

# Port 80 exponieren
EXPOSE 80

# nginx im Vordergrund starten
CMD ["nginx", "-g", "daemon off;"]
