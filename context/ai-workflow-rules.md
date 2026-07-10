# AI Workflow Rules — IDBI TrustBank+

These rules govern how an AI coding agent (or a human following the same
discipline) should work through this project. Read this after the other four
context files and before writing any code.

## 1. Reading Order (repeat of top-level instruction, enforced here too)

1. `context/project-overview.md`
2. `context/architecture.md`
3. `context/ui-context.md`
4. `context/code-standards.md`
5. This file
6. `context/progress-tracker.md`

Never start implementation without having read all five files above in this run.

## 2. Scoping Rules

- Work in **feature-sized slices** matching the 10 USPs, not file-by-file. One
  slice = one USP = one vertical cut (mobile screen + API endpoint + tests).
- Build the **MVP Core 4** (see `project-overview.md` §6) completely, end-to-end,
  before touching any stretch feature. A half-built stretch feature is worse for
  the demo than a polished core.
- If a task would require violating an architecture invariant to move faster,
  **stop and flag it** — do not silently violate it. Either find a compliant path
  or explicitly update `context/architecture.md` with reasoning before proceeding.

## 3. Delivery Approach

- Each slice ships as: (a) API contract first (OpenAPI stub + Zod schema), (b)
  backend implementation + tests, (c) mobile screen wired to the real endpoint
  (never wired to a hand-mocked local JSON that later needs replacing), (d)
  manual demo pass against `plan/05-testing-plan.md` cases for that feature.
- Prefer boring, working tech over impressive-but-fragile tech. E.g., a rule-based
  anomaly engine that reliably fires in the demo beats a half-trained ML model
  that might not.
- Every slice ends with a `context/progress-tracker.md` update (see §5).

## 4. Handling Ambiguity

- If a requirement is ambiguous, choose the interpretation that best serves the
  **documented real-world pain point** it traces back to
  (`plan/00-problem-research.md`), state the assumption in a code comment or PR
  description, and proceed — do not block on it unless it would change the
  architecture.
- If two USPs conflict (e.g., simplicity vs. information density), default to
  the **Simple mode wins by default, Pro mode is opt-in** rule already encoded in
  `ui-context.md` §3.

## 5. Progress Tracking Discipline

After every meaningful change (a slice completed, an architecture decision made,
a scope cut):

1. Update `context/progress-tracker.md`: move the item from "In Progress" to
   "Done", note any deviation from the plan and why.
2. If the change alters architecture, scope, or standards, update the relevant
   `context/*.md` file **in the same work session**, before starting the next
   slice — context files must never drift from reality.
3. Log any new open question surfaced during the work, even if not yet answered.

## 6. Definition of Done (per feature slice)

A slice is only "done" when:

- [ ] API contract documented (OpenAPI) and matches `shared-types`.
- [ ] Backend tests pass: happy path + validation failure + the specific edge
      case(s) listed for that feature in `plan/05-testing-plan.md`.
- [ ] Mobile screen renders correctly in both Simple and Pro mode where relevant.
- [ ] Offline/error state has been manually triggered and looks intentional, not
      broken.
- [ ] `progress-tracker.md` updated.

## 7. What the Agent Should NOT Do

- Do not add a new external dependency without checking `code-standards.md` §1
  first — stick to the named stack.
- Do not implement real payment rails, real SMS/OTP gateways, or real KYC
  verification — these are explicit non-goals (`project-overview.md` §8).
- Do not let a stretch feature block a core feature's test coverage or polish.
- Do not silently change the Simple/Pro mode contract (client-presentation-only,
  architecture invariant #6) to solve a rendering problem — solve it client-side.
