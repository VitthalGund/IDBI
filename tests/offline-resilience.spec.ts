import { test, expect } from '@playwright/test';

async function loginHelper(page: any) {
  await page.goto('/');
  const usernameInput = page.getByPlaceholder('Enter username');
  await expect(usernameInput).toBeVisible({ timeout: 30000 });
  await usernameInput.fill('admin');
  await page.getByPlaceholder('Enter password').fill('admin');
  await page.click('text=Sign In');
  await expect(page.locator('text=Step-up verification')).toBeVisible({ timeout: 10000 });
  const otpInput = page.getByPlaceholder('000000');
  await otpInput.fill('123456');
  await page.click('text=Verify OTP');
}

test.describe('Phase 2: Offline Resilience', () => {
  test('should show offline banner when simulated offline mode is toggled', async ({ page }) => {
    await loginHelper(page);

    // Wait for the app to load
    await expect(page.locator('text=Simple').first()).toBeVisible({ timeout: 10000 });

    // Ensure the offline banner is NOT visible initially
    await expect(page.locator('text=Showing saved data')).toBeHidden();

    // Toggle the "Simulate Offline" switch
    // There are two switches now, the first is mode toggle, the second is offline toggle?
    // Let's rely on label text if possible, but React Native Web uses role="switch"
    // Since there are two switches, the first one in the DOM is the Offline Mode toggle
    const devToggle = page.getByRole('switch').first();
    await devToggle.click();

    // Banner should appear
    await expect(page.locator('text=Showing saved data')).toBeVisible();
    
    // Turn it back off
    await devToggle.click();
    await expect(page.locator('text=Showing saved data')).toBeHidden();
  });
});
