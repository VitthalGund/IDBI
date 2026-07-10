# IDBI TrustBank+

IDBI TrustBank+ is a reliability-first, adaptive mobile banking layer built for the **IDBI Innovate 2026 — Mobile Banking Innovation** track.

## Features (Core MVP + Stretch Goals)

1. **Risk-Based Adaptive Authentication**: Reduces OTP fatigue by conditionally skipping OTPs for trusted devices based on risk scoring.
2. **Offline-Resilient Session Handling**: Queues actions locally when internet drops and replays them, preventing crashes or forced reactivations.
3. **One-Tap AI Grievance Triage**: AI classifies grievance severity and assigns an instant ETA using Gemini 2.5 Flash, replacing static acknowledgement messages.
4. **Progressive-Disclosure (Simple / Pro Mode)**: Toggles between a low-density "Simple" mode and a data-rich "Pro" mode instantly without needing two separate apps.
5. **MSME Cash-Flow Cockpit**: Provides MSME users with cash-in vs cash-out metrics and active working capital nudges based on pending GST invoices.
6. **Rule-Based Anomaly Nudges**: Flags suspicious transactions instantly via simple rules (unusual amount/time) with plain-language explanations.

## Setup Instructions

### Prerequisites

- Node.js & pnpm
- Docker & Docker Compose
- A Gemini API Key for the Grievance feature (`GEMINI_API_KEY`)

### 1. Environment Setup

Create a `.env.local` file in the root of the workspace and at `apps/api-gateway/.env.local` with the following content:

```
GEMINI_API_KEY=your_actual_gemini_api_key
```

### 2. Infrastructure (PostgreSQL Database)

Start the mock PostgreSQL database using Docker Compose:

```bash
cd infra
docker-compose up -d
```

_(The database runs on port 5435 to avoid conflicts)._

### 3. Install Dependencies

Install packages using the pnpm workspace:

```bash
pnpm install
```

### 4. Start the Application

You can start the backend API and the mobile frontend simultaneously:

```bash
# Terminal 1: Start the NestJS Backend
pnpm --filter api-gateway run start:dev

# Terminal 2: Start the Expo Mobile App (Web for testing/demo)
pnpm --filter mobile run web
```

### 5. Running Tests

We have comprehensive unit tests in the backend and End-to-End tests using Playwright.

```bash
# Run Playwright E2E Tests
npx playwright test
```

## Demo Instructions

To present the app, follow the narrative in `context/demo-script.md`. It outlines how to effectively show all Core MVP features in one continuous, compelling flow.

---

**Note:** All banking features (transactions, balances, devices) are mock implementations tailored for the hackathon presentation.
