# 04 — Data & "Models" (Honest Approach for a Lighter-ML Team)

## 1. The Core Decision: Rules + LLM API, Not Custom-Trained Models
Given the team is strong full-stack/mobile and lighter on ML, and the build
window is 36–48 hours, **no feature in this project requires training a custom
model from scratch.** This is a deliberate, judge-defensible choice, not a
shortcut:
- A rule-based/explainable system is *more* trustworthy to bank judges than an
  opaque model with no real training data behind it.
- A hand-trained model on a 36-hour timeline with no real labeled data would
  almost certainly be worse than a well-designed rule engine or an LLM API call
  with good prompting.

Where "AI" is needed, this project uses two techniques only:
1. **Deterministic rule engines** (trust scoring, anomaly nudges) — see §1–2.
2. **Prompted calls to an existing LLM API** (grievance classification) — see §3.

## 2. Adaptive-Auth Trust Scoring (Rule Engine, not ML)
**Inputs (all collectable client-side, no special dataset needed):**
- Device ID match vs. last N successful logins
- Time since last successful session on this device
- Geo/IP consistency vs. recent history (coarse, city-level only)
- Number of failed attempts in the current window

**Scoring approach:** simple weighted-sum threshold, e.g.:
```
score = 0.5*device_match + 0.3*recency_ok + 0.2*geo_consistent
if score >= 0.7: skip step-up OTP
else: require OTP once, then log a new trust event
```
This is intentionally simple and fully explainable — the "why" affordance in the
UI (`ui-context.md` §3) literally reads off these factors. No training data
needed; thresholds are tuned by hand during Phase 4 testing.

## 3. Grievance Classification (LLM API + Rule-Based Fallback)
**Primary path:** one call to an LLM API per new grievance, prompted to return
strict JSON: `{ category, severity (1-5), eta_band }`. Categories are a fixed,
small taxonomy (e.g., Login/Access, Transaction Delay, App Crash, Card/OTP,
Other) — a fixed taxonomy keeps this reliable without any fine-tuning.

**Fallback path (required, not optional):** a keyword/regex-based classifier
that maps common complaint phrases to the same taxonomy, used automatically if
the LLM API call fails or times out. This guarantees the flagship demo feature
never breaks on venue Wi-Fi.

**"Dataset" for this feature:** you do not need a training dataset — you need a
**test/demo dataset**: 15–20 realistic sample grievance texts (write these
yourselves, grounded in the real complaint themes from `00-problem-research.md`:
crashes, forced reactivation, OTP repetition, transaction delays, slow
resolution). Use these to validate the classifier's category/severity output is
sensible and consistent, and to rehearse the live demo.

## 4. Anomaly Nudges (Rule Engine, not ML)
**Inputs:** mock transaction stream (amount, time, merchant/location tag).
**Rules (all explainable, each fires with a plain-language reason shown to the
user):**
- Amount > 3x the user's trailing 30-day average → "This is much larger than
  your usual transactions."
- Transaction outside usual active hours (e.g., 1am–5am) → "Unusual time for
  your account."
- Rapid sequence of transactions within a short window → "Several transactions
  in quick succession."

**"Dataset" for this feature:** the same seeded mock transaction set from
`02-build-plan.md` Phase 0, plus 3–5 deliberately anomalous seeded transactions
written by hand to reliably trigger each rule during the demo.

## 5. If a Future (Post-Hackathon) Team Wants Real ML
For transparency and to answer judge questions honestly if asked "what's the
real production plan":
- Anomaly detection could graduate to an unsupervised model (e.g., isolation
  forest) trained on real anonymized transaction history once IDBI-scale data is
  available — not feasible or honest to claim during the hackathon itself.
- Grievance classification could graduate to a fine-tuned or embedding-based
  classifier once a real labeled ticket history exists (hundreds–thousands of
  resolved tickets with human-assigned categories).
- Both of these require real production data governed by IDBI's own data-access
  and privacy policies — explicitly out of scope for a hackathon prototype, and
  the pitch should say so plainly rather than imply a trained model exists today.

## 6. Data Privacy Discipline (applies even to mock data)
- No real customer data is used anywhere in this build — all accounts,
  transactions, and grievances are synthetic/seeded.
- PII redaction (`code-standards.md` §8) is implemented and tested even though
  the data is synthetic, specifically so the architecture is demonstrably
  production-honest, not just demo-convenient.
