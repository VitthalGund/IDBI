# 01 — Features & USPs (Detailed)

## 1. The 10 USPs — Full Detail

### 1. Risk-Based Adaptive Authentication
- **What:** Reduces redundant OTP prompts within a trusted session using a
  device-trust score (device match, recency, geo-consistency).
- **Why unique:** Directly answers a documented YONO complaint (OTP fatigue) that
  even the market leader hasn't solved.
- **Feasibility:** Rule-based scoring, no ML training needed. Easy–Medium.
- **Wow factor:** 8/10 — judges immediately feel the friction reduction live.

### 2. Offline-Resilient Session Handling
- **What:** Caches last-known screen state, queues actions during connectivity
  drops, replays idempotently on reconnect.
- **Why unique:** Targets IDBI's #1 documented complaint (crashes/forced
  reactivation) head-on.
- **Feasibility:** Medium — needs a disciplined offline-queue pattern, but no
  exotic tech.
- **Wow factor:** 9/10 — a live "turn off Wi-Fi mid-action" demo is dramatic and
  easy to stage.

### 3. One-Tap AI Grievance Triage
- **What:** LLM-classified complaint (category, severity, ETA) with live status,
  replacing a static "we'll respond in X days" message.
- **Why unique:** No competitor exposes real-time, explainable triage to the user;
  IDBI's real process is multi-level and opaque.
- **Feasibility:** Medium — one LLM API call + a ticket state machine.
- **Wow factor:** 10/10 — flagship feature, directly contrasts against IDBI's
  documented 30-day process.

### 4. Progressive-Disclosure "Simple / Pro" Mode
- **What:** One app, two densities — a large-tile, plain-language mode and a
  full-density power mode, switchable live.
- **Why unique:** Competitors treat simplicity and power as a single fixed
  design choice; nobody cleanly offers both.
- **Feasibility:** Easy–Medium — presentation-layer only (see architecture
  invariant #6).
- **Wow factor:** 8/10 — visually obvious in a 30-second demo.

### 5. MSME Cash-Flow Cockpit
- **What:** In-app view of GST-linked invoices, cash-in/cash-out trend, and
  working-capital nudges.
- **Why unique:** Fills a gap despite IDBI's explicit MSME/Agri mandate — no
  in-app MSME tooling exists today.
- **Feasibility:** Medium — mock invoice data + simple trend visualization.
- **Wow factor:** 7/10 — strong with judges who know IDBI's MSME positioning.

### 6. Rule-Based Real-Time Anomaly Nudges
- **What:** Explainable pattern rules (unusual amount, unusual location, unusual
  time-of-day) flag transactions instantly with a plain-language reason.
- **Why unique:** Explainability, not black-box ML — realistic for a
  lighter-ML team, and arguably more trustworthy to a bank judge panel.
- **Feasibility:** Easy — rule engine, no training data needed.
- **Wow factor:** 7/10.

### 7. Vernacular Voice Assist
- **What:** Voice-driven balance/help queries in Hindi + one regional language.
- **Why unique:** Competes directly with YONO's existing multilingual assist,
  positioned at IDBI's Tier-2/3 base.
- **Feasibility:** Medium–Hard — stub with a small fixed intent set for the demo
  rather than open-domain voice.
- **Wow factor:** 7/10, but riskiest to demo live — keep scripted.

### 8. NRI Remote-Registration Fix
- **What:** Streamlined remote KYC/registration flow for foreign numbers and
  devices.
- **Why unique:** Addresses a documented, specific registration failure mode.
- **Feasibility:** Medium — mock verification steps, no real KYC integration.
- **Wow factor:** 6/10 — narrower audience but a clean, well-evidenced story.

### 9. LITE Data Mode
- **What:** Low-bandwidth fallback UI (text-first, minimal imagery), matching the
  strategy competitors already use for low-connectivity regions.
- **Why unique:** Directly serves IDBI's semi-urban/rural footprint.
- **Feasibility:** Easy — a second, lighter set of screen variants.
- **Wow factor:** 6/10.

### 10. Family/Dependent Guided View
- **What:** A permissioned, simplified view for elderly or less digitally-fluent
  account holders, optionally supervised by a trusted family member.
- **Why unique:** No major competitor app solves this segment well today.
- **Feasibility:** Medium — reuses Simple mode UI plus a permission layer.
- **Wow factor:** 7/10 — strong emotional resonance with judges.

## 2. Prioritization Matrix

| Feature | User Impact (1–10) | Wow Factor (1–10) | Feasibility in 36–48h (1–10) | Overall | Must/Nice |
|---|---|---|---|---|---|
| Grievance Triage (#3) | 9 | 10 | 7 | 26 | Must |
| Offline Resilience (#2) | 9 | 9 | 6 | 24 | Must |
| Adaptive Auth (#1) | 8 | 8 | 7 | 23 | Must |
| Simple/Pro Mode (#4) | 8 | 8 | 8 | 24 | Must |
| Anomaly Nudges (#6) | 7 | 7 | 8 | 22 | Stretch |
| MSME Cockpit (#5) | 8 | 7 | 6 | 21 | Stretch |
| LITE Mode (#9) | 6 | 6 | 8 | 20 | Stretch |
| Dependent View (#10) | 7 | 7 | 6 | 20 | Stretch |
| NRI Fix (#8) | 6 | 6 | 6 | 18 | Nice |
| Voice Assist (#7) | 6 | 7 | 4 | 17 | Nice |

## 3. Core MVP (locked)
Grievance Triage, Offline Resilience, Adaptive Auth, Simple/Pro Mode — these four
make the project undeniably strong on their own even with zero stretch features.

## 4. The Killer Integration / Twist
Tie all four Core MVP features together through **one live demo narrative**: a
user loses connectivity mid-transaction (offline resilience), reconnects without
losing progress, is *not* re-prompted for OTP because the device is trusted
(adaptive auth), notices something looks off and files a one-tap grievance that
gets triaged instantly with a visible ETA (grievance triage) — all inside an
interface that looks completely different depending on whether Simple or Pro mode
is active (progressive disclosure). One flow, four USPs, no feature feels bolted
on.
