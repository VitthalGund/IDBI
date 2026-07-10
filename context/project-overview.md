# Project Overview — IDBI TrustBank+

## 1. What This Is

IDBI TrustBank+ is a reliability-first, adaptive mobile banking layer built for the
**IDBI Innovate 2026 — Mobile Banking Innovation** track. It targets the bank's
real, documented pain points (crashes/forced reactivation, OTP fatigue, slow
grievance resolution, feature overload for first-time users, weak MSME tooling)
rather than a generic "AI banking app" pitch.

## 2. One-Sentence Problem Statement

IDBI Bank's retail and MSME customers abandon or distrust the mobile banking app
due to unreliable sessions, repetitive authentication friction, and a slow, opaque
grievance process — while competitor apps have solved reliability but still haven't
solved authentication fatigue or first-time-user overload.

## 3. Target Users (see `plan/00-problem-research.md` for full personas)

| Persona                                               | Core Need                                     |
| ----------------------------------------------------- | --------------------------------------------- |
| First-time digital banking user (semi-urban/Tier-2/3) | Simplicity, low cognitive load                |
| MSME / Agri-banking owner                             | Cash-flow visibility, working-capital nudges  |
| NRI account holder                                    | Frictionless remote registration/verification |
| Elderly / low digital-literacy dependent              | Guided, permissioned banking view             |

## 4. Core Pillars

1. **Reliability** — resilient session handling, offline-first fallback.
2. **Low-friction trust** — risk-based auth, fewer redundant OTPs.
3. **Radical simplicity** — progressive disclosure (Simple / Pro mode).
4. **Assisted resolution** — AI-assisted grievance triage instead of a multi-week
   escalation ladder.

## 5. The 10 USPs (build targets)

1. Risk-based adaptive authentication (device-trust scoring, fewer repeat OTPs)
2. Offline-resilient session handling (local queueing, crash-safe state)
3. One-tap AI grievance triage with live ETA
4. Progressive-disclosure "Simple / Pro" UI mode
5. MSME Cash-Flow Cockpit (GST-linked invoicing view, working-capital nudges)
6. Rule-based real-time anomaly nudges (explainable, no heavy ML)
7. Vernacular voice assist
8. NRI remote-registration friction fix
9. LITE data mode for low-bandwidth regions
10. Family/Dependent guided view for elderly or less digitally-fluent users

Full rationale, scoring, and prioritization in `plan/01-features-and-usp.md`.

## 6. MVP Scope (hackathon-buildable in 36–48 hrs)

**In scope for MVP (Core 4):**

- Progressive-disclosure Simple/Pro UI (#4)
- Offline-resilient session handling, demoable via simulated network drop (#2)
- One-tap AI grievance triage (LLM-API classification + mock ticket state machine) (#3)
- Risk-based adaptive auth demo (device-trust scoring, simulated OTP skip) (#1)

**Stretch (if time remains):** MSME Cash-Flow Cockpit (#5), rule-based anomaly
nudges (#6), LITE data mode (#9).

**Explicitly out of scope for MVP:** real core-banking integration, real OTP/SMS
gateway, real KYC/NRI verification, production-grade fraud ML, voice assist beyond
a stub, native biometric hardware calls (simulate instead).

## 7. Success Metrics (what "done" looks like for the demo)

- Judge can see a crash/network-drop recovery without losing form state.
- Judge can submit a mock grievance and see instant AI-classified severity + ETA
  instead of a static "we'll get back to you" message.
- Judge can toggle Simple → Pro mode and see the UI genuinely change density/depth.
- A short benchmarking slide/table shows before/after metrics vs the documented
  competitor and IDBI pain points (see `plan/05-testing-plan.md` for how these are
  measured, even if simulated for the demo).

## 8. Non-Goals

This is not a full core-banking replacement, not a production fraud-ML system, and
not a real-money transacting app. All banking operations are simulated against a
mock backend/sandbox, clearly labeled as such in the UI and in the pitch.
