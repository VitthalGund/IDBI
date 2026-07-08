# 00 — Problem Research (Condensed)

_Full detail was covered live during ideation; this file is the durable record so
implementation decisions can always be traced back to evidence, not assumption._

## 1. Track Selected
**IDBI Innovate 2026 — Mobile Banking Innovation** (chosen over Wealth Advisory,
Conversational AI, and the open Novel Idea track — see rationale in §5).

## 2. Evidence of the Real Problem
- IDBI's own app has a low public rating (~2.1/5 on review aggregators) with
  recurring complaints about crashing and forced reactivation.
- App-store reviews describe a tedious, failure-prone login flow and
  unpredictable transaction processing delays.
- Competitor apps score far higher (HDFC ~4.7, ICICI ~4.6, Axis ~4.8) — proving
  reliability is a solvable, demonstrated-elsewhere problem, not an industry-wide
  ceiling.
- Even the best competitor (SBI YONO) has its own unresolved gaps: users describe
  it as overwhelming for first-time users, and report OTP fatigue — being asked
  to re-authenticate for actions already inside an authenticated session.
- IDBI's grievance process is explicitly multi-level and slow: Level I → II → III
  escalation, up to ~30 days before Ombudsman escalation is even possible.
- IDBI carries a strong MSME/Agri-banking mandate but has no in-app MSME cash-flow
  or working-capital tooling, unlike dedicated business-banking apps competitors
  offer as separate products.

## 3. Personas
| Persona | Role/context | Top frustration | Top goal |
|---|---|---|---|
| First-time digital user | Tier-2/3 semi-urban, new smartphone user | App feels dense/scary, unsure what's safe to tap | Do basic tasks without fear of mistakes |
| MSME/Agri owner | Runs a small business, uses IDBI for working capital | No cash-flow visibility in-app, has to use spreadsheets/other apps | See money in/out at a glance, get proactive nudges |
| NRI account holder | Lives abroad, manages India-based account remotely | Registration/verification flows fail for foreign numbers/devices | Frictionless remote access without repeated verification pain |
| Elderly/dependent user | Relies on a family member for digital banking help | Can't safely navigate the app alone, fears mistakes | A guided, permissioned way to bank safely |

## 4. Hidden/Secondary Problems Most Teams Miss
- **Trust, not just uptime.** Reliability complaints are also a trust problem —
  users don't just want fewer crashes, they want to *understand* why the app
  behaved a certain way (e.g., why OTP was or wasn't asked). Transparency is a
  feature, not a footnote.
- **The grievance loop is a retention killer**, not just a support-cost problem —
  a slow, opaque complaint process actively drives users back to branches, which
  undermines the entire "digital-first" strategy.
- **MSME is underserved specifically inside the retail app**, not because MSME
  tooling doesn't exist anywhere at IDBI, but because it's siloed away from the
  primary app experience.
- **"Simplicity" and "power" are usually treated as opposites** by competitors —
  nobody has cleanly solved offering both in one app without one persona paying
  the tax for the other's needs.

## 5. Why This Track (vs. the other three)
| Track | Why not chosen |
|---|---|
| Wealth Advisory | Needs credible portfolio/risk modeling — hard to make defensible in front of bank judges without deep quant/ML depth the team doesn't have. |
| Conversational AI | Most saturated hackathon category; hard to differentiate meaningfully in 36–48 hrs. |
| Novel Idea (open) | No sandbox/data alignment, harder to look "implementation-ready," which IDBI explicitly rewards in judging. |
| **Mobile Banking Innovation** | Plays directly to team's full-stack/mobile strength; problem is evidence-backed, not invented; allows 2–3 genuinely AI-flavored features via lightweight APIs without needing deep ML expertise. |

## 6. Why Now
- LLM APIs make "smart triage" and "explainable auth" achievable without any
  custom model training — this was not cheaply possible 2 years ago.
- React Native/Expo + managed Postgres/Redis make a believable full-stack banking
  demo buildable solo or in a small team within a hackathon window.
- Rising UPI/digital-banking penetration into Tier-2/3 India makes the
  "simplicity for first-time users" angle timely and judge-relatable, not niche.
