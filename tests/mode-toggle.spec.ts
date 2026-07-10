import { test, expect } from "@playwright/test";

async function loginHelper(page: any) {
  await page.goto("/");
  const usernameInput = page.getByPlaceholder("Enter username");
  await expect(usernameInput).toBeVisible({ timeout: 30000 });
  await usernameInput.fill("admin");
  await page.getByPlaceholder("Enter password").fill("admin");
  await page.click("text=Sign In");
  await expect(page.locator("text=Step-up verification")).toBeVisible({
    timeout: 10000,
  });
  const otpInput = page.getByPlaceholder("000000");
  await otpInput.fill("123456");
  await page.click("text=Verify OTP");
}

test.describe("Phase 1: Simple/Pro UI Mode Toggle", () => {
  test("should load in Simple mode by default and switch to Pro mode", async ({
    page,
  }) => {
    // Perform login first
    await loginHelper(page);

    // Wait for the text to ensure it's loaded (Metro bundling might take a while on first load)
    await expect(page.locator("text=Simple").first()).toBeVisible({
      timeout: 10000,
    });

    // In simple mode, it should say "Good Morning!" and show "Your Balance"
    await expect(page.locator("text=Good Morning!")).toBeVisible();
    await expect(page.locator("text=Your Balance")).toBeVisible();
    await expect(page.locator("text=Send Money")).toBeVisible();

    // Check that Pro mode elements are NOT visible
    await expect(page.locator("text=Dashboard Overview")).toBeHidden();

    // Toggle the mode switch (we'll click the role="switch" at the bottom of the DOM, which is ModeToggle)
    await page.getByRole("switch").last().click();

    // Now it should be in Pro mode
    await expect(page.locator("text=Dashboard Overview")).toBeVisible();
    await expect(page.locator("text=Total Balance")).toBeVisible();
    await expect(page.locator("text=Recent Transactions")).toBeVisible();

    // And Simple mode elements should be hidden
    await expect(page.locator("text=Good Morning!")).toBeHidden();
  });
});
