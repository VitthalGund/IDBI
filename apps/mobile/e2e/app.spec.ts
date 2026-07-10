import { test, expect } from '@playwright/test';

test.describe('App Frontend E2E', () => {
  test('should login and navigate to dashboard', async ({ page }) => {
    // Go to the app
    await page.goto('/');

    // Since our app uses AsyncStorage, let's clear it first
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();

    // Check if we are on the login screen (it should have username input)
    // Actually the placeholder is 'Enter your username'
    const usernameInput = page.getByPlaceholder('Enter username');
    await expect(usernameInput).toBeVisible();

    // Fill in the login form
    await usernameInput.fill('demoUser');
    await page.getByText('Sign In').click({ timeout: 15000 });
    // Debug check: Did it fail?
    await expect(page.getByText('Connection to backend failed')).not.toBeVisible();
    await expect(page.getByText('Login failed')).not.toBeVisible();

    // Wait for the OTP screen
    const otpInput = page.getByPlaceholder('000000');
    await expect(otpInput).toBeVisible({ timeout: 10000 });

    // Fill in the OTP
    await otpInput.fill('123456');
    await page.getByText('Verify OTP').click();

    // Wait for the Consent screen
    const registerDeviceBtn = page.getByText('Yes, Register Device');
    await expect(registerDeviceBtn).toBeVisible({ timeout: 10000 });
    await registerDeviceBtn.click();

    // Expect to see the Home screen with Balance
    await expect(page.getByText('Account Balance')).toBeVisible({ timeout: 10000 });
    
    // Check if the balance is loaded
    await expect(page.getByText('₹ 15,000.50')).toBeVisible();

    // Toggle Lite Mode
    const liteModeSwitch = page.locator('input[type="checkbox"]');
    await liteModeSwitch.click();

    // Verify it changed to Lite Mode text
    await expect(page.getByText('Text-only mode optimized for slow networks')).toBeVisible();
    await liteModeSwitch.click(); // toggle back

    // Create a grievance
    await page.getByText('Report an Issue').click();
    await expect(page.getByText('Describe your issue in detail')).toBeVisible();

    const grievanceInput = page.getByPlaceholder('Describe your issue...').first();
    await grievanceInput.fill('My money was deducted but not credited to merchant');
    await page.getByText('Analyze Issue').click();

    // It should navigate to status page and show the intent
    await expect(page.getByText('transaction_failure')).toBeVisible({ timeout: 15000 });
  });
});
