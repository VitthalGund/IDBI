import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:8081",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // We only need Chromium for the web export E2E for now
  ],
  webServer: [
    {
      command: "pnpm --filter api-gateway start:dev",
      port: 3000,
      reuseExistingServer: !process.env.CI,
      env: {
        NODE_ENV: "test", // so backend uses sqlite
      },
      timeout: 300 * 1000,
    },
    {
      command:
        "pnpm --filter mobile run export:web && pnpm --filter mobile run serve:web",
      port: 8081,
      reuseExistingServer: !process.env.CI,
      timeout: 300 * 1000,
    },
  ],
});
