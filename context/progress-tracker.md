# Progress Tracker — IDBI TrustBank+

_Last updated: initial planning pass (pre-implementation)._

## Current Phase
**Phase 0 — Planning complete, implementation not started.**

## Completed
- [x] Problem-statement research and track selection (Mobile Banking Innovation)
      — see `plan/00-problem-research.md`.
- [x] 10 USPs defined and prioritized — see `plan/01-features-and-usp.md`.
- [x] Build plan and phased timeline drafted — see `plan/02-build-plan.md`.
- [x] Tech stack finalized — see `plan/03-tech-stack.md`.
- [x] Data/model approach defined (rule-based + LLM-API, no heavy training) —
      see `plan/04-data-and-models.md`.
- [x] Test plan drafted per feature — see `plan/05-testing-plan.md`.
- [x] All `context/*.md` files authored.

## In Progress
- [ ] Nothing yet — next action is Phase 1 setup (see `plan/02-build-plan.md`).

## Open Questions
1. Team name, team leader name, and final registration details not yet filled
   into the pitch deck title slide (currently placeholders).
2. Confirm whether a real LLM API key/budget is available for the hackathon venue
   Wi-Fi, or whether the Grievance Service classification should have a fully
   offline rule-based fallback baked in from the start (recommended either way —
   see `plan/04-data-and-models.md` §3).
3. Confirm demo device specs (Android version, screen size) so LITE mode and
   low-end-device testing target the actual hardware being used on stage.
4. Decide whether MSME Cash-Flow Cockpit (stretch) or rule-based anomaly nudges
   (stretch) gets priority if only one stretch slot is achievable in the
   remaining time budget.

## Next Steps (in order)
1. Scaffold repo per `context/code-standards.md` §2 (monorepo structure,
   docker-compose, CI lint/test hook).
2. Build MVP Core Slice 1: Progressive-disclosure Simple/Pro UI shell (no live
   data yet — static/mock data is fine at this step).
3. Build MVP Core Slice 2: Offline-resilient session handling (network-drop
   demo scenario).
4. Build MVP Core Slice 3: One-tap AI grievance triage (end-to-end).
5. Build MVP Core Slice 4: Risk-based adaptive auth demo.
6. Run full `plan/05-testing-plan.md` pass on Core 4.
7. If time remains, pick one stretch feature per Open Question #4.
8. Freeze build, record demo video, fill in deck snapshots/benchmarking slides.

## Update Log
| Date | Change |
|---|---|
| (fill in) | Initial planning artifacts created |
