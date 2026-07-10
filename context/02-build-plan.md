# 02 — Build Plan (Step by Step)

## 1. Timeline Overview (36–48 hr hackathon window)

| Phase                        | Hours | Goal                                                           |
| ---------------------------- | ----- | -------------------------------------------------------------- |
| Phase 0 — Setup              | 0–3   | Repo scaffold, docker-compose stack running, CI lint/test hook |
| Phase 1 — Core Slice 1       | 3–9   | Simple/Pro UI shell with mock data                             |
| Phase 2 — Core Slice 2       | 9–17  | Offline-resilient session handling                             |
| Phase 3 — Core Slice 3       | 17–27 | AI grievance triage, end-to-end                                |
| Phase 4 — Core Slice 4       | 27–34 | Adaptive auth demo                                             |
| Phase 5 — Integration        | 34–38 | Wire the single demo narrative end-to-end                      |
| Phase 6 — Stretch (if time)  | 38–42 | One stretch feature (Anomaly or MSME)                          |
| Phase 7 — Polish & rehearsal | 42–48 | Bugfix, demo script, deck snapshots, video                     |

## 2. Phase 0 — Setup (Detailed)

1. `npx create-nx-workspace` or a plain pnpm monorepo per `code-standards.md` §2.
2. `docker-compose.yml`: postgres, redis, minio (optional), api-gateway.
3. Seed script: creates 2 mock accounts, 20 mock transactions, 3 mock MSME
   invoices — needed by almost every later slice, build it first.
4. ESLint/Prettier/husky pre-commit wired.
5. `expo init` mobile app, connect to local API gateway via `.env`.
6. **Exit criteria:** `docker-compose up` + `expo start` both work; a health-check
   screen in the app shows "API: OK" from a real network call.

## 3. Phase 1 — Simple/Pro UI Shell

1. Build `ui-kit` package: Card, StatusPill, ModeToggle components
   (`ui-context.md` §4).
2. Build Home screen in both modes against seeded mock account/transaction data.
3. Settings screen with the mode toggle (persists locally, not on server —
   architecture invariant #6).
4. **Exit criteria:** Toggling mode visibly changes density/copy without an app
   reload; screenshots captured for the deck.

## 4. Phase 2 — Offline Resilience

1. Implement `apiClient` wrapper (code-standards.md §5) with local queue
   (AsyncStorage-backed) and idempotent UUID per queued action.
2. Simulate network loss in-app (dev toggle) for reliable demo staging — do not
   depend on actually disabling device Wi-Fi during the pitch.
3. Add "Showing saved data — last updated Xm ago" banner component.
4. **Exit criteria:** Killing connectivity mid-action, then restoring it, replays
   the queued action exactly once and the banner disappears correctly.

## 5. Phase 3 — AI Grievance Triage

1. Grievance Service: ticket model (Open/Triaged/In-Progress/Resolved), Postgres
   table, REST endpoints (create, get, list, status stream).
2. PII-redaction layer (regex-based) before any text leaves the service.
3. LLM API call: classify category + severity (1–5) + ETA band; **must have a
   deterministic rule-based fallback classifier** if the API is unavailable
   (see `plan/04-data-and-models.md` §3) — never let a network hiccup break the
   flagship demo feature.
4. Mock resolver worker: timer-based status advancement for demo purposes.
5. Mobile: grievance submission screen + live status screen (WebSocket or
   polling fallback).
6. **Exit criteria:** Submitting a sample grievance shows classified severity +
   ETA within a few seconds, and status visibly advances during the demo.

## 6. Phase 4 — Adaptive Auth

1. Auth Service: device-fingerprint capture (device ID + basic signals),
   trust-score rules engine (`plan/04-data-and-models.md` §1).
2. Redis-backed trust store, append-only event log (architecture invariant #5).
3. Mobile: login flow that conditionally shows/skips OTP screen based on
   trust-score response; "why" info affordance (`ui-context.md` §3).
4. **Exit criteria:** First login on a "new" simulated device requires OTP;
   subsequent logins on the same simulated device skip it, with the reason shown
   on tap.

## 7. Phase 5 — Integration (the single demo narrative)

1. Script the exact click-path: Home (Pro mode) → start a transfer → simulate
   connectivity drop mid-flow → reconnect → action completes without data loss →
   login again on the same device (no OTP, tap "why") → notice a transaction,
   file grievance → see live triage/ETA → toggle to Simple mode to show the
   contrast.
2. Rehearse this exact path at least 3 times before freezing scope.
3. **Exit criteria:** The full narrative runs without a single manual server
   restart or hidden reset step.

## 8. Phase 6 — Stretch (only if Phase 5 exit criteria met early)

- Prefer **Anomaly Nudges** over MSME Cockpit if time is tight — it's Easy
  feasibility and reuses the existing transaction seed data with no new schema.

## 9. Phase 7 — Polish & Rehearsal

1. Capture real screenshots for deck slides 6 (wireframes) and 10 (snapshots) —
   replace any placeholder mockups.
2. Record the 3-minute demo video required by the submission (`plan/plan` link
   slide requirement).
3. Fill in `plan/05-testing-plan.md` results into the benchmarking deck slide.
4. Final pass on `context/progress-tracker.md` — mark all slices Done, note any
   scope cuts and why.
