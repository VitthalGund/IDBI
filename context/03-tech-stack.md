# 03 — Tech Stack & Tools

## 1. Mobile
| Tool | Purpose |
|---|---|
| React Native + Expo | Cross-platform app, fast iteration, easy demo deployment via Expo Go |
| TypeScript | Type safety across the whole stack |
| React Navigation | Screen/tab navigation |
| Zustand | Lightweight client state (mode toggle, offline queue state) |
| AsyncStorage | Local cache + offline action queue |
| React Native Testing Library + Jest | Component tests |
| Reanimated (optional) | Smooth mode-switch transition — nice-to-have polish only |

## 2. Backend
| Tool | Purpose |
|---|---|
| Node.js + NestJS | BFF + all services, consistent module structure |
| Prisma ORM | Postgres access, migrations, seed scripts |
| Zod | Request/response validation, shared with mobile via `shared-types` |
| Socket.IO (or plain polling fallback) | Live grievance-status push |
| @nestjs/swagger | OpenAPI contract generation |
| @nestjs/throttler | Rate limiting |
| Jest + Supertest | Backend unit + integration tests |

## 3. Data & AI
| Tool | Purpose |
|---|---|
| Anthropic/OpenAI-compatible LLM API | Grievance text classification (category/severity/ETA) |
| Custom rule engine (plain TypeScript, no framework) | Anomaly nudges, adaptive-auth trust scoring, and the offline fallback classifier for grievance triage |
| Postgres | System of record for tickets, mock accounts/transactions, MSME invoices |
| Redis | Sessions, device-trust scores, offline-queue dedup |

_No custom ML model training is required or recommended — see
`plan/04-data-and-models.md` for the full reasoning, since the team is
full-stack/mobile-strong and lighter on ML._

## 4. Infra & Dev Tooling
| Tool | Purpose |
|---|---|
| Docker + docker-compose | Local Postgres, Redis, MinIO (optional), all services |
| GitHub + GitHub Actions | Repo hosting, CI (lint + test on push) |
| ESLint (airbnb-typescript) + Prettier | Code style |
| Husky + lint-staged | Pre-commit enforcement |
| MinIO (optional) | S3-compatible storage for grievance attachments, only if time allows |

## 5. Design & Deck
| Tool | Purpose |
|---|---|
| Figma (optional, time-permitting) | Wireframes for deck slide 6 |
| PowerPoint (official IDBI Innovate template) | Submission deck |
| Loom / OBS | Demo video recording |

## 6. Explicitly Avoided (and why)
- **Kubernetes / multi-region infra** — unnecessary complexity for a 36–48 hr
  build and a single-device demo.
- **Custom-trained ML models (fraud, NLP)** — no reliable labeled dataset
  available in the timeframe; rule-based + LLM-API approach is both faster to
  build and more explainable to bank judges (see `04-data-and-models.md`).
- **GraphQL** — REST is faster to scaffold and document (OpenAPI) for a small
  team under time pressure.
- **Native iOS/Android modules** — Expo managed workflow avoids native build
  complexity; nothing in the MVP genuinely requires ejecting.
