# IDBI TrustBank+ Demo Script

This document outlines the step-by-step narrative for the hackathon presentation. It orchestrates all 6 completed phases into one continuous flow, proving that TrustBank+ is a cohesive product rather than disconnected features.

## Setup Before Demo
1. Ensure `docker-compose up -d` is running.
2. Run `pnpm --filter api-gateway run start:dev` and `pnpm --filter mobile run web`.
3. Clear `localStorage` in the browser or reset the `deviceId` in the app to start with a trust score of 0.
4. Have the Web preview open side-by-side or cast a physical device to the screen.

---

## 1. Introduction (30 seconds)
"Good morning, judges. We are presenting **IDBI TrustBank+**, designed specifically to solve IDBI's documented pain points: OTP fatigue, forced session drops, opaque grievance handling, and MSME feature gaps. Our solution prioritizes reliability and progressive trust over gimmicky features."

## 2. Phase 4: Risk-Based Adaptive Authentication (1 min)
*Goal: Show how we reduce OTP fatigue securely.*
- **Action**: Open the app. Enter the username and password on the Login Screen.
- **Narrative**: "First time logging in on this device? We perform a step-up authentication. The backend detects this is a new device with a trust score of 0."
- **Action**: Fill the OTP and submit. We land on the Home screen.
- **Action**: Tap **Sign Out**. Then log in again.
- **Narrative**: "Now, notice what happens when we log in again. No OTP. Our Adaptive Auth engine stored an append-only trust event for this device on the initial MFA success. We skipped the friction, and the UI transparently tells the user why (Point out the green shield `🛡️ MFA verified successfully`)."

## 3. Phase 1 & 6: Progressive Disclosure & Anomaly Nudges (1 min)
*Goal: Demonstrate the Simple/Pro toggle and real-time rules.*
- **Narrative**: "Now we are in the app. Notice this is 'Simple Mode' – big, high-contrast tiles designed for our first-time digital users or elderly demographics."
- **Action**: Toggle the **Pro Mode** switch in the top right.
- **Narrative**: "But for power users, one tap switches the density. We see balances, transaction histories, and crucially, **Security Nudges**."
- **Action**: Point to the yellow Security Nudge on the screen.
- **Narrative**: "Our backend rule-engine flagged an anomaly—a huge transaction at 2 AM—and explains it to the user in plain language, building trust without complex black-box ML."

## 4. Phase 5: MSME Cash-Flow Cockpit (30 seconds)
*Goal: Show IDBI-specific business features.*
- **Action**: In Pro Mode, click the **MSME Cash-Flow** button (`→`).
- **Narrative**: "For IDBI's core MSME customers, we built a dedicated cockpit. It tracks Cash In vs Cash Out and pending GST invoices, and even triggers a working capital nudge if they have pending invoices they can get an advance on."
- **Action**: Click **Back to Dashboard**.

## 5. Phase 2 & 3: Offline Resilience + AI Grievance (1.5 min)
*Goal: The killer combo. Simulating a network drop during a critical action.*
- **Narrative**: "Let's say the user sees that anomaly and wants to report it. But just as they are typing..."
- **Action**: Toggle the yellow **Offline Mode** switch in the Dev Bar to simulate a network drop. The red 'Showing saved data' banner appears.
- **Narrative**: "They lose signal—a huge pain point in Tier-2 regions. In the current YONO/IDBI app, they'd be kicked out. In TrustBank+, they keep working."
- **Action**: Scroll down to the Grievance form. Type: `"I didn't make this 85,000 transaction at 2 AM. Please block my card."` Click **Submit**.
- **Narrative**: "We submit the grievance. The app caches it locally and safely queues it." (Show the 'Saved offline' alert).
- **Action**: Toggle the **Offline Mode** switch back to false.
- **Narrative**: "Once connectivity returns, the queued request is processed instantly by our **AI Grievance Triage** engine using Gemini 2.5 Flash."
- **Action**: Click **Submit** again (to simulate the sync/retry) and show the Success Alert containing the JSON classification.
- **Narrative**: "Instead of a generic 'We will get back to you', the AI immediately classifies it as HIGH severity, category 'FRAUD', and promises an ETA of 2 hours. We took a 30-day opaque process and made it a 3-second transparent one."

## 6. Closing (30 seconds)
"In under 5 minutes, we demonstrated Adaptive Auth, Progressive UI, MSME Tooling, Offline Resilience, and AI Grievance Triage. TrustBank+ doesn't just look modern; it fundamentally repairs the trust relationship between the bank and its customers."
