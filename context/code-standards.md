# Code Standards — IDBI TrustBank+

## 1. Languages & Frameworks

- **Mobile:** React Native + Expo, TypeScript strict mode.
- **Backend (BFF + services):** Node.js + NestJS, TypeScript strict mode.
- **DB access:** Prisma ORM against Postgres.
- **Validation:** Zod (shared schema definitions between mobile and backend where
  possible, via a small shared `types` package).

## 2. Repo Structure

```
/apps
  /mobile              # Expo app
  /api-gateway         # NestJS BFF
  /auth-service
  /grievance-service
  /anomaly-service
  /msme-service
/packages
  /shared-types        # Zod schemas + TS types shared across apps
  /ui-kit              # Cards, status pills, mode-aware components
/context               # this folder
/plan                  # this folder
/infra
  docker-compose.yml
```

## 3. Naming Conventions

- Files: `kebab-case.ts`, React components: `PascalCase.tsx`.
- Branches: `feature/<short-desc>`, `fix/<short-desc>`.
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`).
- API routes: `/v1/<service>/<resource>`, plural nouns (`/v1/grievance/tickets`).

## 4. Formatting & Linting

- ESLint (airbnb-typescript base) + Prettier, run on pre-commit via `husky` +
  `lint-staged`. No manual style debates — config is the source of truth.
- No `any` in TypeScript without an inline `// eslint-disable-next-line` and a
  one-line justification comment.

## 5. Error Handling

- Backend: every service throws typed exceptions (`DomainError` subclasses),
  caught by a single NestJS exception filter that maps to a consistent JSON error
  shape: `{ code, message, details? }`. Never leak stack traces to the client.
- Mobile: every network call goes through a single `apiClient` wrapper that
  handles offline queueing (idempotent UUID per action), retries, and surfaces
  errors via the shared `ui-kit` toast component — no ad hoc `fetch` calls inside
  screen components.

## 6. Testing Conventions

- Unit tests: Jest, co-located `*.spec.ts` next to source.
- Mobile component tests: React Native Testing Library.
- API integration tests: Supertest against a docker-compose test DB.
- Every new service endpoint requires: 1 happy-path test, 1 validation-failure
  test, 1 edge-case test (see `plan/05-testing-plan.md` for the specific cases per
  feature — do not invent ad hoc cases that skip that list).
- Coverage percentage is not the goal; **invariant coverage is** — every
  architecture invariant in `context/architecture.md` §4 must have at least one
  test that would fail if it were violated.

## 7. API Contract Discipline

- Every service exposes an OpenAPI spec (`@nestjs/swagger` decorators); the
  shared-types package is generated from/kept in sync with these specs, not
  hand-duplicated.
- Breaking a contract requires updating `context/architecture.md` first (see
  `ai-workflow-rules.md` — architecture changes are documented before code).

## 8. Security Baseline (non-negotiable even for a hackathon build)

- No secrets in source; use `.env` + `.env.example`, `.env` git-ignored.
- All PII (name, phone, account-like fields) redacted before any LLM API call
  (regex-based redaction layer in Grievance Service — test this explicitly).
- JWT session tokens, short TTL (15 min access / 7 day refresh), refresh rotation
  on use.
- Rate limiting on all public BFF routes (NestJS throttler).
