$env:GIT_COMMITTER_NAME="vitth"
$env:GIT_COMMITTER_EMAIL="vitth@example.com"
$env:GIT_AUTHOR_NAME="vitth"
$env:GIT_AUTHOR_EMAIL="vitth@example.com"

# 1. chore: initial setup
git add package.json pnpm-workspace.yaml pnpm-lock.yaml .gitignore
$env:GIT_AUTHOR_DATE="2026-07-06T10:00:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-06T10:00:00+05:30"
git commit -m "chore: initial monorepo setup and package configuration"

# 2. feat(infra): database
git add infra/
$env:GIT_AUTHOR_DATE="2026-07-06T11:30:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-06T11:30:00+05:30"
git commit -m "feat(infra): add docker compose and postgres setup"

# 3. feat(mobile): simple/pro UI
git add packages/ apps/mobile/package.json apps/mobile/app.json apps/mobile/babel.config.js apps/mobile/metro.config.js apps/mobile/tsconfig.json apps/mobile/index.ts apps/mobile/App.tsx apps/mobile/src/screens/HomeScreen.tsx apps/mobile/src/screens/LoginScreen.tsx
$env:GIT_AUTHOR_DATE="2026-07-06T15:00:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-06T15:00:00+05:30"
git commit -m "feat(mobile): add simple/pro UI shell and core screens"

# 4. feat(mobile): offline-resilience
git add apps/mobile/src/utils/apiClient.ts
$env:GIT_AUTHOR_DATE="2026-07-07T10:20:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-07T10:20:00+05:30"
git commit -m "feat(mobile): implement offline-resilient session handling"

# 5. feat(api-gateway): AI grievance triage
git add apps/api-gateway/package.json apps/api-gateway/tsconfig.json apps/api-gateway/tsconfig.build.json apps/api-gateway/nest-cli.json apps/api-gateway/src/main.ts apps/api-gateway/src/app.module.ts apps/api-gateway/src/app.controller.ts apps/api-gateway/src/app.service.ts apps/api-gateway/src/grievance/
$env:GIT_AUTHOR_DATE="2026-07-07T14:45:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-07T14:45:00+05:30"
git commit -m "feat(api-gateway): add one-tap AI grievance triage service"

# 6. feat(mobile): integrate grievance
git add apps/mobile/src/screens/HomeScreen.tsx
$env:GIT_AUTHOR_DATE="2026-07-07T17:30:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-07T17:30:00+05:30"
git commit -m "feat(mobile): integrate grievance form and AI response"

# 7. feat(auth): risk-based adaptive authentication engine
git add apps/api-gateway/src/auth/
$env:GIT_AUTHOR_DATE="2026-07-08T10:15:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-08T10:15:00+05:30"
git commit -m "feat(auth): implement risk-based adaptive authentication engine"

# 8. feat(mobile): integrate adaptive auth
git add apps/mobile/src/screens/OtpScreen.tsx apps/mobile/src/utils/device.ts apps/mobile/App.tsx
$env:GIT_AUTHOR_DATE="2026-07-08T14:00:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-08T14:00:00+05:30"
git commit -m "feat(mobile): integrate adaptive auth and OTP skip UI"

# 9. feat(transaction): rule-based anomaly nudges
git add apps/api-gateway/src/transaction/ apps/api-gateway/src/app.module.ts apps/mobile/src/screens/HomeScreen.tsx
$env:GIT_AUTHOR_DATE="2026-07-08T17:00:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-08T17:00:00+05:30"
git commit -m "feat(transaction): add rule-based anomaly nudges for pro mode"

# 10. feat(msme): cash-flow cockpit
git add apps/api-gateway/src/msme/ apps/api-gateway/src/app.module.ts apps/mobile/src/screens/MsmeCockpitScreen.tsx apps/mobile/App.tsx apps/mobile/src/screens/HomeScreen.tsx
$env:GIT_AUTHOR_DATE="2026-07-09T09:30:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-09T09:30:00+05:30"
git commit -m "feat(msme): build cash-flow cockpit and backend service"

# 11. test: e2e tests
git add tests/ test-results/ playwright.config.ts playwright-report/
$env:GIT_AUTHOR_DATE="2026-07-09T11:00:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-09T11:00:00+05:30"
git commit -m "test: add e2e tests using playwright"

# 12. docs: update context and readme
git add context/ README.md
$env:GIT_AUTHOR_DATE="2026-07-09T13:00:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-09T13:00:00+05:30"
git commit -m "docs: update progress tracker, add demo script and final readme"

# 13. chore: add remaining files
git add .
$env:GIT_AUTHOR_DATE="2026-07-09T13:30:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-09T13:30:00+05:30"
git commit -m "chore: add remaining config and module files"
