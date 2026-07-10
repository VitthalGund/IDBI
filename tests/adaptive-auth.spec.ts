import { test, expect } from "@playwright/test";

test.describe("Phase 4: Adaptive Authentication", () => {
  test("should require OTP on first login, then skip it on second login (trusted device)", async ({
    page,
  }) => {
    // Go to the app
    await page.goto("/");

    // 1. We are on the Login screen. Wait for username input
    const usernameInput = page.getByPlaceholder("Enter username");
    await expect(usernameInput).toBeVisible({ timeout: 30000 });

    // Since it's a new device, it should show "MFA: OTP Required" or similar trust profile preview
    await expect(page.locator("text=OTP Required").first()).toBeVisible();

    // Type credentials
    await usernameInput.fill("admin");
    await page.getByPlaceholder("Enter password").fill("admin");
    await page.click("text=Sign In");

    // 2. We should be redirected to OTP Screen
    await expect(page.locator("text=Step-up verification")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator("text=New device detected")).toBeVisible(); // Info box reason

    // Enter invalid OTP first
    const otpInput = page.getByPlaceholder("000000");
    await otpInput.fill("000000");
    await page.click("text=Verify OTP");
    await expect(page.locator("text=Invalid OTP")).toBeVisible();

    // Enter correct OTP
    await otpInput.fill("123456");
    await page.click("text=Verify OTP");

    // 3. We should be on Home Screen
    await expect(page.locator("text=Simple").first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator("text=MFA verified successfully")).toBeVisible(); // Trust reason indicator

    // 4. Sign Out to test the skip OTP flow
    await page.click("text=Sign Out");

    // 5. Back on Login screen. Now the device is trusted!
    // The adaptive security profile should preview "🛡️ Trusted"
    await expect(page.locator("text=Trusted")).toBeVisible({ timeout: 5000 });

    // Click Sign In again
    await page.click("text=Sign In");

    // 6. Should skip OTP screen and go directly to Home Screen
    await expect(page.locator("text=Simple").first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator("text=Device fingerprint matches")).toBeVisible(); // Trust reason indicator
  });
});
