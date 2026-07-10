# UI Context — IDBI TrustBank+

## 1. Brand Anchor

Derived from the official IDBI Innovate 2026 template so the product screenshots
visually match the pitch deck.

| Token                | Value                             | Use                                               |
| -------------------- | --------------------------------- | ------------------------------------------------- |
| `--brand-teal-900`   | #0F3D3E                           | Header gradient start, primary dark surfaces      |
| `--brand-teal-600`   | #158158                           | Primary buttons, active states                    |
| `--brand-orange-500` | #ED561B                           | Accent, alerts-that-are-not-errors, CTA highlight |
| `--surface-white`    | #FFFFFF                           | Card backgrounds                                  |
| `--surface-fog`      | #F3F3F3                           | App background                                    |
| `--text-ink`         | #000000 (at 87% opacity for body) | Primary text                                      |
| `--status-success`   | #50B432                           | Success/positive delta                            |
| `--status-info`      | #058DC7                           | Informational                                     |
| `--status-warn`      | #EDEF00 (on dark only)            | Caution                                           |
| `--status-danger`    | #ED561B / #C0392B                 | Errors, destructive actions                       |

## 2. Typography

- Primary typeface: system default (San Francisco on iOS, Roboto on Android) —
  do not bundle a custom font for the hackathon build, it's not worth the time.
- Scale: 24/20/16/14/12 sp for H1/H2/Body-Large/Body/Caption.
- Weight: bold (700) for headers and inline labels ("Status:", "ETA:"), regular
  (400) for body copy — mirrors the deck's own convention of bolding labels.

## 3. Simple vs Pro Mode (the core UI differentiator)

| Aspect      | Simple mode                                                                | Pro mode                                                          |
| ----------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Home screen | 3 large tiles: Balance, Pay, Help                                          | Full dashboard: balance, spends chart, MSME cockpit, anomaly feed |
| Navigation  | Bottom bar, 3 items max                                                    | Bottom bar, 5 items + drawer                                      |
| Copy tone   | Plain language, no jargon ("Send money" not "Initiate NEFT/IMPS transfer") | Full terminology, precise labels                                  |
| Density     | Large touch targets (≥48dp), generous spacing                              | Compact, information-dense                                        |
| Default for | First-time users, elderly/dependent view                                   | Power users, MSME owners                                          |

Mode is a **presentation-only** toggle (see architecture invariant #6) — same data,
different rendering. This must be demoable live by flipping a switch in Settings.

## 4. Component Conventions

- **Cards** are the base content unit (rounded 12dp corners, 1dp border in
  `--surface-fog` on white). Every feature (Grievance, Anomaly nudge, MSME
  cockpit tile) is a card so the design language stays consistent across all 10
  USPs without needing bespoke layouts each time.
- **Status pills** (Open/Triaged/In-Progress/Resolved, Trust score bands) use
  filled rounded-pill badges with the status color tokens above — never rely on
  color alone, always pair with a text label (accessibility).
- **Empty/offline states** are first-class, not an afterthought: every screen that
  can show stale/cached data must show a visible "Showing saved data — last
  updated Xm ago" banner, directly demonstrating USP #2 (offline resilience).
- **OTP/trust explainability**: any time an OTP step is skipped, show a small
  info icon → tap reveals "Skipped because: recognized device + recent
  successful session" in plain language.

## 5. Accessibility & Real-World Constraints

- Minimum tap target 44x44pt; body text never below 12sp.
- Support Hindi + one regional language string set (stub via i18n keys even if only
  English is fully translated for the demo) to back up the "vernacular" USP claim.
- Design for low-end Android screens (5.5"–6.1", 720p) first, not just the demo
  device — IDBI's real user base skews toward budget Android devices.
- Every screen must render a usable (if degraded) state at 2G/3G-equivalent
  throttling — this is directly tested in `plan/05-testing-plan.md`.

## 6. What NOT to design

- No skeuomorphic bank-card art, no heavy illustration work — time is better spent
  on the interaction states above. Judges reward working interaction over visual
  polish for this deck's stated criteria.
