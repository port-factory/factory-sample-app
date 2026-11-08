# Working on factory-sample-app

## Run the app

```bash
npm ci
npm run demo   # backend on :3000 (in-memory sample tasks, no database needed) + frontend on :5173
API_PORT=3100 npm run demo   # if port 3000 is taken
```

Open http://localhost:5173. The API is proxied under `/api`.

## Screenshots

To capture the UI, for example to show a bug before and after a fix:

```bash
npx -y playwright@1.49.1 install --with-deps chromium
npx -y playwright@1.49.1 screenshot --viewport-size=1280,800 --wait-for-timeout=1500 http://localhost:5173 screenshot.png
```

## Checks

Every PR must pass the CI checks in `.github/workflows/ci.yml`. Run them locally before pushing:

```bash
npm run lint && npm run format:check && npm run typecheck && npm run test:unit
npm run test:integration -w frontend
```

Backend integration tests need Postgres (`npm run db:up`, then set `DATABASE_URL`).
