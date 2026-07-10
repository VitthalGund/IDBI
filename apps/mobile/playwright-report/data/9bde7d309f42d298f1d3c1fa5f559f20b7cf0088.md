# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> App Frontend E2E >> should login and navigate to dashboard
- Location: e2e\app.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Account Balance')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('Account Balance')

```

```yaml
- text: 🛡️ MFA verified successfully LITE
- switch
- text: Simple
- switch
- text: Pro Sign Out Good Morning! Your Balance ₹15,000.5 Send Money Get Help Submit Grievance
- textbox "Describe your issue..."
- text: Submit via AI
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('App Frontend E2E', () => {
  4  |   test('should login and navigate to dashboard', async ({ page }) => {
  5  |     // Go to the app
  6  |     await page.goto('/');
  7  | 
  8  |     // Since our app uses AsyncStorage, let's clear it first
  9  |     await page.evaluate(() => window.localStorage.clear());
  10 |     await page.reload();
  11 | 
  12 |     // Check if we are on the login screen (it should have username input)
  13 |     // Actually the placeholder is 'Enter your username'
  14 |     const usernameInput = page.getByPlaceholder('Enter username');
  15 |     await expect(usernameInput).toBeVisible();
  16 | 
  17 |     // Fill in the login form
  18 |     await usernameInput.fill('demoUser');
  19 |     await page.getByText('Sign In').click({ timeout: 15000 });
  20 |     // Debug check: Did it fail?
  21 |     await expect(page.getByText('Connection to backend failed')).not.toBeVisible();
  22 |     await expect(page.getByText('Login failed')).not.toBeVisible();
  23 | 
  24 |     // Wait for the OTP screen
  25 |     const otpInput = page.getByPlaceholder('000000');
  26 |     await expect(otpInput).toBeVisible({ timeout: 10000 });
  27 | 
  28 |     // Fill in the OTP
  29 |     await otpInput.fill('123456');
  30 |     await page.getByText('Verify OTP').click();
  31 | 
  32 |     // Wait for the Consent screen
  33 |     const registerDeviceBtn = page.getByText('Yes, Register Device');
  34 |     await expect(registerDeviceBtn).toBeVisible({ timeout: 10000 });
  35 |     await registerDeviceBtn.click();
  36 | 
  37 |     // Expect to see the Home screen with Balance
> 38 |     await expect(page.getByText('Account Balance')).toBeVisible({ timeout: 10000 });
     |                                                     ^ Error: expect(locator).toBeVisible() failed
  39 |     
  40 |     // Check if the balance is loaded
  41 |     await expect(page.getByText('₹ 15,000.50')).toBeVisible();
  42 | 
  43 |     // Toggle Lite Mode
  44 |     const liteModeSwitch = page.locator('input[type="checkbox"]');
  45 |     await liteModeSwitch.click();
  46 | 
  47 |     // Verify it changed to Lite Mode text
  48 |     await expect(page.getByText('Text-only mode optimized for slow networks')).toBeVisible();
  49 |     await liteModeSwitch.click(); // toggle back
  50 | 
  51 |     // Create a grievance
  52 |     await page.getByText('Report an Issue').click();
  53 |     await expect(page.getByText('Describe your issue in detail')).toBeVisible();
  54 | 
  55 |     const grievanceInput = page.getByPlaceholder('Describe your issue...').first();
  56 |     await grievanceInput.fill('My money was deducted but not credited to merchant');
  57 |     await page.getByText('Analyze Issue').click();
  58 | 
  59 |     // It should navigate to status page and show the intent
  60 |     await expect(page.getByText('transaction_failure')).toBeVisible({ timeout: 15000 });
  61 |   });
  62 | });
  63 | 
```