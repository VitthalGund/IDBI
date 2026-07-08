# Architecture — IDBI TrustBank+

## 1. System Shape (high level)

```
[ Mobile App (React Native/Expo) ]
        |  HTTPS/JSON (REST) + WebSocket (grievance status push)
        v
[ API Gateway / BFF (Node.js + NestJS) ]
        |
        +--> [ Auth Service ]        -> device-trust store (Redis)
        +--> [ Accounts/Txn Mock ]   -> Postgres (mock core-banking data)
        +--> [ Grievance Service ]   -> Postgres + LLM API (classification)
        +--> [ Anomaly Service ]     -> rule engine, reads Txn stream
        +--> [ MSME Cockpit Service]-> Postgres (invoices/cash-flow mock data)
        v
[ Postgres (primary) ] [ Redis (session/cache/trust score) ] [ S3-compatible (docs) ]
```

Everything below the API Gateway is a **mock/sandbox layer** — there is no real
core-banking connection. This must stay true through the whole build; do not let
scope creep pull in a real banking integration.

## 2. Boundaries (what owns what)
- **Mobile app** owns: UI state, offline queue, Simple/Pro mode state, local cache
  of last-known-good screen data.
- **API Gateway (BFF)** owns: request shaping for mobile, auth token issuance,
  rate limiting, routing to services. Mobile never talks to services directly.
- **Auth Service** owns: device-trust scoring, session issuance, OTP-skip decision
  logic. This is the only service allowed to read/write trust scores.
- **Grievance Service** owns: ticket lifecycle (Open → Triaged → In-Progress →
  Resolved), and the only service allowed to call the LLM classification API.
- **Anomaly Service** owns: read-only subscription to transaction events; never
  writes to the accounts table.
- **MSME Cockpit Service** owns: invoice/cash-flow read models only; no write path
  to core transactional data in MVP.

## 3. Storage Model
| Store | Used for | Notes |
|---|---|---|
| Postgres | accounts (mock), transactions (mock), grievance tickets, MSME invoices | single schema per service, no cross-service joins |
| Redis | session tokens, device-trust scores, offline-queue dedup keys | TTL-based, never source of truth for money data |
| S3-compatible bucket (e.g. MinIO locally) | uploaded grievance attachments, mock KYC docs | never store raw PII unencrypted |

## 4. Invariants (do not violate)
1. **No real money movement.** All transaction data is seeded/mocked. Any "Pay/
   Transfer" action in the UI must hit the mock service, never a real payment rail.
2. **BFF is the only entry point.** Mobile app never calls a downstream service URL
   directly, even in dev — this keeps the auth/rate-limit boundary real.
3. **Grievance Service is the only caller of the LLM API.** Keeps a single place to
   control prompt/PII redaction and cost.
4. **Offline queue is idempotent.** Every queued action carries a client-generated
   UUID so replays after reconnect never double-submit.
5. **Device-trust score changes are append-only** (event log), never overwritten in
   place — needed for the "why was I asked for OTP" explainability requirement.
6. **Simple/Pro mode is a client-side presentation flag only** — it must never gate
   what data the API returns, only how the client renders it. Keeps the backend
   simple and avoids permission-logic duplication.

## 5. Process Flow (grievance triage — flagship feature)
1. User submits grievance (free text + optional attachment) → BFF.
2. Grievance Service creates ticket (status=Open), calls LLM API with redacted
   text to classify: category, severity (1–5), suggested ETA band.
3. Ticket updated to Triaged with category/severity/ETA; WebSocket push to app.
4. Mock resolver worker advances ticket through In-Progress → Resolved on a timer
   for demo purposes (represents what a human agent queue would do).
5. User sees live status + ETA at every stage — contrast this explicitly against
   IDBI's real documented 3-level, up-to-30-day escalation path in the pitch.

## 6. Process Flow (adaptive auth)
1. On login, client sends device fingerprint + last-known trust signals.
2. Auth Service scores trust (recency, device match, geo-consistency — all rule-
   based, see `plan/04-data-and-models.md`).
3. If score ≥ threshold: skip step-up OTP, issue session token.
4. If score < threshold: require OTP once, then raise trust score for the session.
5. Every skip/require decision is logged (invariant #5) and surfaced to the user
   via a "Why am I not being asked for OTP?" info affordance — this transparency
   is itself a USP, not just a technical shortcut.

## 7. Deployment Shape (hackathon-realistic)
- Single docker-compose stack: `api-gateway`, `postgres`, `redis`, `minio`
  (optional), mobile app run via Expo Go for the demo device.
- No Kubernetes, no multi-region — that would be over-engineering for a 36–48 hr
  build and would not help the judging criteria.
