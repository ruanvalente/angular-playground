# angular-playground

Angular 20 standalone + Angular Universal (SSR) + Express + Docker + Nginx

## Scripts

- `npm run build:ssr` — build production (generates `dist/angular-playground/browser` and `dist/angular-playground/server`)
- `npm run serve:ssr` — run server from bundle (node)
- `npm run dev:ssr` — dev mode: build watch + nodemon to reload server
- `npm run test` — run Karma tests

## Dev (local)

1. Install deps:
   npm ci
2. Install nodemon for watching:
   npm i -D nodemon
3. Run dev with live reload:
   npm run dev:ssr
   Open http://localhost:4000

## Docker (production)

Build and run:
docker build -t angular-playground:prod .
docker run -p 4000:4000 angular-playground:prod

## Docker Compose (dev)

docker-compose up

## Docker Compose (prod)

docker-compose -f docker-compose.prod.yml up --build -d
Open http://localhost

## Nginx

Nginx serves static browser files and proxies dynamic requests to Node SSR on port 4000.

## GitHub Actions

Pushes trigger tests, build and deploy. Configure Vercel secrets if needed.
