# ---- Build Stage ----
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build browser + server (Angular 21 uses a single ng build for SSR)
RUN npm run build

# ---- Production Stage ----
FROM node:20-slim AS production

WORKDIR /app

# copy server & browser artifacts
COPY --from=builder /app/dist/angular-playground/browser ./dist/browser
COPY --from=builder /app/dist/angular-playground/server ./dist/server
COPY --from=builder /app/package.json ./

# install only production deps
RUN npm install --omit=dev --no-audit --no-fund

EXPOSE 4000

CMD ["node", "dist/server/server.mjs"]
