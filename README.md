# factory-sample-app

A small full-stack Tasks app used as a test bed for the factory. It exists to have
realistic code paths and a meaningful set of CI checks.

| Part       | Stack                                  | Unit tests                                   | Integration tests                                    |
| ---------- | -------------------------------------- | -------------------------------------------- | ---------------------------------------------------- |
| `backend`  | Node 22, Express, TypeScript, Postgres | Vitest: validation, sorting, routes (in-mem) | Vitest + Supertest against a real Postgres           |
| `frontend` | React 18, Vite, TypeScript             | Vitest + Testing Library: components, utils  | Full `<App />` with the real API client, MSW backend |

## Getting started

```bash
npm install
npm run db:up                  # Postgres on :5432 (set DB_PORT to change the host port)
DATABASE_URL=postgres://app:app@localhost:5432/tasks_test npm run dev -w backend
npm run dev -w frontend        # http://localhost:5173, proxies /api to :3000
```

## Scripts (run from the repo root)

| Command                    | What it does                                                   |
| -------------------------- | -------------------------------------------------------------- |
| `npm run lint`             | ESLint across both workspaces                                  |
| `npm run format:check`     | Prettier check                                                 |
| `npm run typecheck`        | `tsc --noEmit` in each workspace                               |
| `npm run test:unit`        | Unit tests (no external dependencies)                          |
| `npm run test:integration` | Integration tests (backend needs Postgres, see `DATABASE_URL`) |
| `npm run build`            | Production builds                                              |

## CI checks

Every PR runs `.github/workflows/ci.yml`, one job per check:

- **Lint & format**
- **Typecheck**
- **Backend unit tests**
- **Backend integration tests** (Postgres service container)
- **Frontend unit tests**
- **Frontend integration tests**
- **Build**

## API

| Method   | Path             | Body                                            |
| -------- | ---------------- | ----------------------------------------------- |
| `GET`    | `/api/health`    |                                                 |
| `GET`    | `/api/tasks`     | returns `{ tasks, summary }`                    |
| `POST`   | `/api/tasks`     | `{ title, priority?: "low"\|"medium"\|"high" }` |
| `PATCH`  | `/api/tasks/:id` | `{ done: boolean }`                             |
| `DELETE` | `/api/tasks/:id` |                                                 |
