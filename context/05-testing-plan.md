# 05 — Testing Plan (Detailed Cases per Feature)

Every feature below must pass its listed cases before being marked Done in
`context/progress-tracker.md`, per the Definition of Done in
`context/ai-workflow-rules.md` §6.

## 1. Progressive-Disclosure Simple/Pro Mode
| # | Case | Type | Expected Result |
|---|---|---|---|
| 1.1 | Toggle Simple → Pro on Home screen | Functional | Layout density and copy change immediately, no reload |
| 1.2 | Toggle persists after app restart | Functional | Mode is remembered locally |
| 1.3 | Toggle with zero transactions in account | Edge case | Both modes render a sane empty state, no crash |
| 1.4 | Toggle on smallest supported screen size (5.5") | Edge case | No overlapping/clipped UI in either mode |
| 1.5 | Backend response identical in both modes | Invariant | Confirms mode is presentation-only (architecture invariant #6) |

## 2. Offline-Resilient Session Handling
| # | Case | Type | Expected Result |
|---|---|---|---|
| 2.1 | Start a transfer, drop connectivity before submit, restore | Functional | Action queues locally, replays once on reconnect |
| 2.2 | Drop connectivity, force-quit app, reopen, restore connectivity | Edge case | Queue survives app restart, still replays exactly once |
| 2.3 | Submit the same queued action twice due to a double-tap | Edge case | Idempotent UUID prevents duplicate submission |
| 2.4 | View Home screen while fully offline | Functional | Cached data shown with "last updated Xm ago" banner |
| 2.5 | Reconnect after cached data is >1 hour stale | Edge case | Banner updates correctly once fresh data loads |
| 2.6 | Simulated 2G/3G throttle | Performance | Screen remains usable (loading states shown, no infinite spinner) |

## 3. One-Tap AI Grievance Triage
| # | Case | Type | Expected Result |
|---|---|---|---|
| 3.1 | Submit a clear complaint ("app keeps crashing") | Functional | Classified as App Crash, plausible severity/ETA returned |
| 3.2 | Submit an ambiguous/short complaint ("it's broken") | Edge case | Still returns a valid category (may be "Other"), does not error |
| 3.3 | LLM API call times out or fails | Edge case | Rule-based fallback classifier returns a result, ticket still created |
| 3.4 | Submit complaint containing PII (phone number, account-like digits) | Security | PII redacted before any text leaves the service (verify via logs/mocked call payload) |
| 3.5 | Submit empty text | Validation failure | Client-side and server-side validation reject with clear error |
| 3.6 | Ticket status advances over the demo timer | Functional | UI updates live (WebSocket or polling) without manual refresh |
| 3.7 | Submit 5 grievances rapidly | Load/edge case | All created correctly, no race condition on ticket IDs |

## 4. Risk-Based Adaptive Authentication
| # | Case | Type | Expected Result |
|---|---|---|---|
| 4.1 | First login on a new simulated device | Functional | OTP required |
| 4.2 | Second login on the same device shortly after | Functional | OTP skipped, trust score high |
| 4.3 | Login attempt from a simulated new geo/IP on a trusted device | Edge case | OTP re-required, reason shown on tap |
| 4.4 | 5 failed login attempts in a row | Security | Account/device temporarily rate-limited, no silent lockout without message |
| 4.5 | Tap "why was I not asked for OTP" | Functional | Plain-language explanation shown, matches actual scoring factors |
| 4.6 | Trust-score event log after multiple sessions | Invariant | Log is append-only, never overwritten (architecture invariant #5) |

## 5. Rule-Based Anomaly Nudges (Stretch)
| # | Case | Type | Expected Result |
|---|---|---|---|
| 5.1 | Transaction 3x above trailing average | Functional | Nudge fires with correct plain-language reason |
| 5.2 | Transaction at 2am (outside usual hours) | Functional | Nudge fires with correct reason |
| 5.3 | Normal transaction within usual patterns | Functional | No nudge fires (no false positive) |
| 5.4 | Multiple rules match one transaction | Edge case | Nudge shows combined/clearest reason, not duplicated banners |

## 6. MSME Cash-Flow Cockpit (Stretch)
| # | Case | Type | Expected Result |
|---|---|---|---|
| 6.1 | View cockpit with seeded invoice data | Functional | Cash-in/cash-out trend renders correctly |
| 6.2 | View cockpit with zero invoices | Edge case | Sane empty state, no crash |
| 6.3 | Working-capital nudge threshold crossed | Functional | Nudge displayed with correct context |

## 7. Cross-Cutting / Non-Functional
| # | Case | Type | Expected Result |
|---|---|---|---|
| 7.1 | All public BFF routes under rate-limit test | Security | Excess requests return 429, not a crash |
| 7.2 | JWT token expiry (15 min) | Security | Access token expires, refresh flow works silently |
| 7.3 | Full demo narrative (`02-build-plan.md` §7) run 3x in a row | Regression | Completes identically each time, no manual reset needed |
| 7.4 | Accessibility: tap targets ≥44pt, text ≥12sp | Accessibility | Verified across both Simple and Pro mode |
| 7.5 | App cold-start time on demo device | Performance | Under ~3s to interactive Home screen |

## 8. What Gets Reported on the Benchmarking Deck Slide
For each Core MVP feature, capture and report:
- Before/after comparison against the documented IDBI/competitor pain point
  (e.g., "grievance ETA: instant in-app estimate vs. up to 30-day real process").
- Pass/fail count from this test plan at the time of the demo freeze.
- Any known limitation, stated honestly (e.g., "LLM classification fallback is
  rule-based and less nuanced than the primary path").
