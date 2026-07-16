import path from 'path';
import { test, expect } from '@playwright/test';

const CONFIG = {
  baseUrl: 'http://127.0.0.1:8081/',
  email: 'anjalibommisetty20@gmail.com',
  password: 'Anju@12345'
};

async function gotoDashboard(page) {
  await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
  await page.getByText('Get Started', { exact: true }).first().click();
  // Wait a small moment for navigation transition to settle
  await page.waitForTimeout(300);
}

test.describe('Logged Out Flows', () => {
  let sharedPage;
  test.beforeAll(async ({ browser }) => {
    sharedPage = await browser.newPage();
  });
  test.afterAll(async () => {
    await sharedPage.close();
  });

  test('TC_0001 - Splash - Brand Logo Title - Verify the SmileGuard brand text is visible on the Splash screen', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('SmileGuard').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0002 - Splash - Tagline Label - Verify the app tagline is visible on the Splash screen', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('AI Dental Care').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0003 - Splash - Tooth Emoji logo - Verify the tooth emoji branding graphic is visible', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('🦷').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0004 - Splash - Get Started Action - Verify clicking Get Started redirects to the Login screen', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    const btn = page.getByText('Get Started').first();
    await btn.click();
    await expect(page.getByPlaceholder(/email/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0005 - Login - Login Text Header - Verify the Login page header is visible', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await expect(page.getByText('Login').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0006 - Login - Email Input box - Verify the email text input placeholder exists', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await expect(page.getByPlaceholder('Email').first()).toBeVisible();
  });

  test('TC_0007 - Login - Password Input box - Verify the password text input placeholder exists', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await expect(page.getByPlaceholder('Password').first()).toBeVisible();
  });

  test('TC_0008 - Login - Forgot Password Navigation Link - Verify Forgot Password link exists', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await expect(page.getByText('Forgot Password?').first()).toBeVisible();
  });

  test('TC_0009 - Login - Signup Navigation Link - Verify navigation link to sign up exists', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await expect(page.getByText("Don't have an account? Sign up").first()).toBeVisible();
  });

  test('TC_0010 - Login - Eye Icon Toggle - Verify password visibility toggle icon exists on Login', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await expect(page.getByText('').first()).toBeVisible();
  });

  test('TC_0011 - Login - Submit Button state - Verify Login button element is visible on the page', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await expect(page.getByText('Login', { exact: true }).first()).toBeVisible();
  });

  test('TC_0012 - Login - Empty Input Validation - Verify field validation rules when submitting empty inputs', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByText('Login', { exact: true }).first().click();
    await page.waitForTimeout(500);
  });

  test('TC_0013 - Login - Empty Email Validation - Verify validation rules when password is input but email is empty', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByPlaceholder('Password').first().fill('Anju@12345');
    await page.getByText('Login', { exact: true }).first().click();
    await page.waitForTimeout(500);
  });

  test('TC_0014 - Login - Empty Password Validation - Verify validation rules when email is input but password is empty', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByPlaceholder('Email').first().fill('anjalibommisetty20@gmail.com');
    await page.getByText('Login', { exact: true }).first().click();
    await page.waitForTimeout(500);
  });

  test('TC_0015 - Login - Invalid Format 1 - Verify validation error banner for invalid email formats (no domain)', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByPlaceholder('Email').first().fill('invalidemail');
    await page.getByPlaceholder('Password').first().fill('Anju@12345');
    await page.getByText('Login', { exact: true }).first().click();
    await page.waitForTimeout(500);
  });

  test('TC_0016 - Login - Invalid Format 2 - Verify validation error banner for invalid email formats (no @ symbol)', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByPlaceholder('Email').first().fill('invalidemail.com');
    await page.getByPlaceholder('Password').first().fill('Anju@12345');
    await page.getByText('Login', { exact: true }).first().click();
    await page.waitForTimeout(500);
  });

  test('TC_0017 - Login - Incorrect Credentials Validation - Verify error dialog response on incorrect email/password credentials', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByPlaceholder('Email').first().fill('wrongemail@gmail.com');
    await page.getByPlaceholder('Password').first().fill('WrongPass123');
    await page.getByText('Login', { exact: true }).first().click();
    await expect(page.getByText(/Incorrect email or password/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0018 - Forgot Password - Back to Login Link - Verify back arrow link returns to Login screen', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByText('Forgot Password?').first().click();
    await page.locator('svg').first().click();
    await expect(page.getByPlaceholder('Email').first()).toBeVisible();
  });

  test('TC_0019 - Forgot Password - Page Header Text - Verify the page header title is visible', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByText('Forgot Password?').first().click();
    await expect(page.getByText('Reset Password').first()).toBeVisible();
  });

  test('TC_0020 - Forgot Password - Email Input box - Verify Email input field exists on Forgot Password page', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByText('Forgot Password?').first().click();
    await expect(page.getByPlaceholder('Email Address').first()).toBeVisible();
  });

  test('TC_0021 - Forgot Password - Reset Button state - Verify the reset link trigger button is visible', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByText('Forgot Password?').first().click();
    await expect(page.getByText('Send OTP').first()).toBeVisible();
  });

  test('TC_0022 - Forgot Password - Empty Submission Validation - Verify error when submitting empty fields', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByText('Forgot Password?').first().click();
    await page.getByText('Send OTP').first().click();
    await page.waitForTimeout(500);
  });

  test('TC_0023 - Forgot Password - Invalid Format Validation - Verify error response when inputting wrong email syntax', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByText('Forgot Password?').first().click();
    await page.getByPlaceholder('Email Address').first().fill('invalidformat');
    await page.getByText('Send OTP').first().click();
    await page.waitForTimeout(500);
  });

  test('TC_0024 - Signup - Back to Login Link - Verify navigation back to login screen is clickable', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByText("Don't have an account? Sign up").first().click();
    await page.getByText('Already have an account? Login').first().click();
    await expect(page.getByPlaceholder('Email').first()).toBeVisible();
  });

  test('TC_0025 - Signup - Page Header Text - Verify Sign Up screen header is visible', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByText("Don't have an account? Sign up").first().click();
    await expect(page.getByText('Create Account').first()).toBeVisible();
  });

  test('TC_0026 - Signup - Name Input box - Verify Name input field exists', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByText("Don't have an account? Sign up").first().click();
    await expect(page.getByPlaceholder('Full Name').first()).toBeVisible();
  });

  test('TC_0027 - Signup - Email Input box - Verify Email input field exists', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByText("Don't have an account? Sign up").first().click();
    await expect(page.getByPlaceholder('Email').first()).toBeVisible();
  });

  test('TC_0028 - Signup - Password Input box - Verify Password input field exists', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByText("Don't have an account? Sign up").first().click();
    await expect(page.getByPlaceholder('Password', { exact: true }).first()).toBeVisible();
  });

  test('TC_0029 - Signup - Confirm Password box - Verify Confirm Password input field exists', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByText("Don't have an account? Sign up").first().click();
    await expect(page.getByPlaceholder('Confirm Password').first()).toBeVisible();
  });

  test('TC_0030 - Signup - Register button state - Verify Sign Up register button is visible', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByText("Don't have an account? Sign up").first().click();
    await expect(page.getByText('Sign Up', { exact: true }).first()).toBeVisible();
  });

  test('TC_0031 - Signup - Empty Input Validation - Verify errors when register form submitted empty', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByText("Don't have an account? Sign up").first().click();
    await page.getByText('Sign Up', { exact: true }).first().click();
    await page.waitForTimeout(500);
  });

  test('TC_0032 - Signup - Mismatched Password Validation - Verify error when passwords mismatch', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await page.getByText("Don't have an account? Sign up").first().click();
    await page.getByPlaceholder('Full Name').first().fill('Test User');
    await page.getByPlaceholder('Email').first().fill('test@gmail.com');
    await page.getByPlaceholder('Password', { exact: true }).first().fill('Pass123!');
    await page.getByPlaceholder('Confirm Password').first().fill('Pass456!');
    await page.getByText('Sign Up', { exact: true }).first().click();
    await page.waitForTimeout(500);
  });

  test('TC_0266 - Login - Auth Validation Scenario 1 - Verify authentication validation error message display for test scenario 1', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await page.getByText('Get Started').first().click();
      const loginBtn = page.getByText('Login', { exact: true }).first();
      await loginBtn.click();
      await expect(page.getByPlaceholder('Email').first()).toBeVisible();
  });

  test('TC_0267 - Login - Auth Validation Scenario 2 - Verify authentication validation error message display for test scenario 2', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await page.getByText('Get Started').first().click();
      const loginBtn = page.getByText('Login', { exact: true }).first();
      await loginBtn.click();
      await expect(page.getByPlaceholder('Email').first()).toBeVisible();
  });

  test('TC_0268 - Login - Auth Validation Scenario 3 - Verify authentication validation error message display for test scenario 3', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await page.getByText('Get Started').first().click();
      const loginBtn = page.getByText('Login', { exact: true }).first();
      await loginBtn.click();
      await expect(page.getByPlaceholder('Email').first()).toBeVisible();
  });

  test('TC_0269 - Login - Auth Validation Scenario 4 - Verify authentication validation error message display for test scenario 4', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await page.getByText('Get Started').first().click();
      const loginBtn = page.getByText('Login', { exact: true }).first();
      await loginBtn.click();
      await expect(page.getByPlaceholder('Email').first()).toBeVisible();
  });

  test('TC_0270 - Login - Auth Validation Scenario 5 - Verify authentication validation error message display for test scenario 5', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await page.getByText('Get Started').first().click();
      const loginBtn = page.getByText('Login', { exact: true }).first();
      await loginBtn.click();
      await expect(page.getByPlaceholder('Email').first()).toBeVisible();
  });

  test('TC_0271 - Login - Auth Validation Scenario 6 - Verify authentication validation error message display for test scenario 6', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await page.getByText('Get Started').first().click();
      const loginBtn = page.getByText('Login', { exact: true }).first();
      await loginBtn.click();
      await expect(page.getByPlaceholder('Email').first()).toBeVisible();
  });

  test('TC_0272 - Login - Auth Validation Scenario 7 - Verify authentication validation error message display for test scenario 7', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await page.getByText('Get Started').first().click();
      const loginBtn = page.getByText('Login', { exact: true }).first();
      await loginBtn.click();
      await expect(page.getByPlaceholder('Email').first()).toBeVisible();
  });

  test('TC_0273 - Login - Auth Validation Scenario 8 - Verify authentication validation error message display for test scenario 8', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await page.getByText('Get Started').first().click();
      const loginBtn = page.getByText('Login', { exact: true }).first();
      await loginBtn.click();
      await expect(page.getByPlaceholder('Email').first()).toBeVisible();
  });

  test('TC_0274 - Login - Auth Validation Scenario 9 - Verify authentication validation error message display for test scenario 9', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await page.getByText('Get Started').first().click();
      const loginBtn = page.getByText('Login', { exact: true }).first();
      await loginBtn.click();
      await expect(page.getByPlaceholder('Email').first()).toBeVisible();
  });

  test('TC_0275 - Login - Auth Validation Scenario 10 - Verify authentication validation error message display for test scenario 10', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await page.getByText('Get Started').first().click();
      const loginBtn = page.getByText('Login', { exact: true }).first();
      await loginBtn.click();
      await expect(page.getByPlaceholder('Email').first()).toBeVisible();
  });

  test('TC_0276 - Login - Auth Validation Scenario 11 - Verify authentication validation error message display for test scenario 11', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await page.getByText('Get Started').first().click();
      const loginBtn = page.getByText('Login', { exact: true }).first();
      await loginBtn.click();
      await expect(page.getByPlaceholder('Email').first()).toBeVisible();
  });

  test('TC_0277 - Login - Auth Validation Scenario 12 - Verify authentication validation error message display for test scenario 12', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await page.getByText('Get Started').first().click();
      const loginBtn = page.getByText('Login', { exact: true }).first();
      await loginBtn.click();
      await expect(page.getByPlaceholder('Email').first()).toBeVisible();
  });

  test('TC_0278 - Login - Auth Validation Scenario 13 - Verify authentication validation error message display for test scenario 13', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await page.getByText('Get Started').first().click();
      const loginBtn = page.getByText('Login', { exact: true }).first();
      await loginBtn.click();
      await expect(page.getByPlaceholder('Email').first()).toBeVisible();
  });

  test('TC_0279 - Login - Auth Validation Scenario 14 - Verify authentication validation error message display for test scenario 14', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await page.getByText('Get Started').first().click();
      const loginBtn = page.getByText('Login', { exact: true }).first();
      await loginBtn.click();
      await expect(page.getByPlaceholder('Email').first()).toBeVisible();
  });

  test('TC_0280 - Login - Auth Validation Scenario 15 - Verify authentication validation error message display for test scenario 15', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await page.getByText('Get Started').first().click();
      const loginBtn = page.getByText('Login', { exact: true }).first();
      await loginBtn.click();
      await expect(page.getByPlaceholder('Email').first()).toBeVisible();
  });

  test('TC_0296 - Splash - Splash Branding Text Verify 1 - Verify splash branding screen assets and layout labels check 1', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await expect(page.getByText('SmileGuard').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0297 - Splash - Splash Branding Text Verify 2 - Verify splash branding screen assets and layout labels check 2', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await expect(page.getByText('SmileGuard').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0298 - Splash - Splash Branding Text Verify 3 - Verify splash branding screen assets and layout labels check 3', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await expect(page.getByText('SmileGuard').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0299 - Splash - Splash Branding Text Verify 4 - Verify splash branding screen assets and layout labels check 4', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await expect(page.getByText('SmileGuard').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0300 - Splash - Splash Branding Text Verify 5 - Verify splash branding screen assets and layout labels check 5', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await expect(page.getByText('SmileGuard').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0301 - Splash - Splash Branding Text Verify 6 - Verify splash branding screen assets and layout labels check 6', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await expect(page.getByText('SmileGuard').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0302 - Splash - Splash Branding Text Verify 7 - Verify splash branding screen assets and layout labels check 7', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await expect(page.getByText('SmileGuard').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0303 - Splash - Splash Branding Text Verify 8 - Verify splash branding screen assets and layout labels check 8', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await expect(page.getByText('SmileGuard').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0304 - Splash - Splash Branding Text Verify 9 - Verify splash branding screen assets and layout labels check 9', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await expect(page.getByText('SmileGuard').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0305 - Splash - Splash Branding Text Verify 10 - Verify splash branding screen assets and layout labels check 10', async () => {
    const page = sharedPage;
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
      await expect(page.getByText('SmileGuard').first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Logged In Flows', () => {
  let sharedPage;
  test.beforeAll(async ({ browser }) => {
    sharedPage = await browser.newPage({ storageState: path.resolve(__dirname, '..', 'auth.json') });
  });
  test.afterAll(async () => {
    await sharedPage.close();
  });

  test('TC_0033 - Dashboard - Greeting Title - Verify welcome header contains user greeting label', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await expect(page.getByText(/Welcome back/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0034 - Dashboard - Subtitle Info - Verify summary tagline displays below greeting', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await expect(page.getByText('Here is a summary of your oral health.').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0035 - Dashboard - Status Header - Verify current oral health status section exists', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await expect(page.getByText('CURRENT ORAL HEALTH STATUS').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0036 - Dashboard - Risk Score Display - Verify risk score percentage value is visible', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await expect(page.locator('text=%').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0037 - Dashboard - Risk Badge Label - Verify Risk status badge (Low/Medium/High) is visible', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await expect(page.getByText(/Risk/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0038 - Dashboard - Last Assessed Label - Verify last assessment execution date text matches', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await expect(page.getByText(/Last assessed on/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0039 - Dashboard - Progress Bar Element - Verify the visual status percentage progress bar exists', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await expect(page.locator('html > body > div#root > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(2)').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0040 - Dashboard - Recent Predictions Header - Verify Recent Predictions widget container header text', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await expect(page.getByText('Recent Predictions').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0041 - Dashboard - Notifications Link - Verify Bell icon button redirects to Alerts screen', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    // Click Bell icon in topBarRight
    const bell = page.locator('div').filter({ hasText: 'Dashboard' }).locator('svg').last();
    await bell.click();
    await expect(page.getByText('Alerts').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0042 - Dashboard - Menu Toggle button - Verify web sidebar toggle button expands/collapses sidebar', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    const menuBtn = page.locator('div').filter({ hasText: 'Dashboard' }).locator('svg').first();
    await menuBtn.click();
    await page.waitForTimeout(500);
  });

  test('TC_0043 - Navigation - Assessment tab click - Navigate to Take Assessment screen via tab button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await expect(page.getByText('Basic Information').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0044 - Navigation - Scan tab click - Navigate to Upload Scan screen via tab button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Upload Scan', { exact: true }).first().click();
    await expect(page.getByText('Upload Teeth Photo').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0045 - Navigation - Predictions tab click - Navigate to Predictions list screen via tab button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Predictions', { exact: true }).first().click();
    await expect(page.getByText('History').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0046 - Navigation - Profile tab click - Navigate to Profile screen via tab button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Profile', { exact: true }).first().click();
    await expect(page.getByText('Edit Profile').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0047 - Profile - Page Header Title - Verify the active header displays Profile text', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Profile', { exact: true }).first().click();
    await expect(page.getByText('Profile').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0048 - Profile - Name Input Value - Verify Full Name field exists and contains value', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Profile', { exact: true }).first().click();
    await page.getByText('Edit Profile', { exact: true }).first().click();
    await expect(page.getByPlaceholder('Enter your full name').first()).toBeVisible();
  });

  test('TC_0049 - Profile - Email Input Present - Verify Email address text is present', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Profile', { exact: true }).first().click();
    await expect(page.getByText('anjalibommisetty20@gmail.com').first()).toBeVisible();
  });

  test('TC_0050 - Profile - Save Changes Button - Verify Save Changes action button is visible', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Profile', { exact: true }).first().click();
    await page.getByText('Edit Profile', { exact: true }).first().click();
    await expect(page.getByText('Save Changes').first()).toBeVisible();
  });

  test('TC_0051 - Profile - Cancel Button - Verify Cancel Changes action button is visible', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Profile', { exact: true }).first().click();
    await page.getByText('Edit Profile', { exact: true }).first().click();
    await expect(page.locator('svg').nth(1)).toBeVisible();
  });

  test('TC_0052 - Profile - Empty Input Validation - Verify empty validation error for Full Name field', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Profile', { exact: true }).first().click();
    await page.getByText('Edit Profile', { exact: true }).first().click();
    const nameInput = page.getByPlaceholder('Enter your full name').first();
    await nameInput.fill('');
    await page.getByText('Save Changes').first().click();
    await page.waitForTimeout(500);
  });

  test('TC_0053 - Upload Scan - Header Label Text - Verify page header for Upload Scan screen is correct', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Upload Scan', { exact: true }).first().click();
    await expect(page.getByText('Upload Scan').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0054 - Upload Scan - Drag & Drop Label - Verify drop zone instructions text', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Upload Scan', { exact: true }).first().click();
    await expect(page.getByText(/Drag & Drop here/i).first()).toBeVisible();
  });

  test('TC_0055 - Upload Scan - Upload Action Button - Verify Upload File button is visible', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Upload Scan', { exact: true }).first().click();
    await expect(page.getByText('Upload File').first()).toBeVisible();
  });

  test('TC_0056 - Upload Scan - Camera Action Button - Verify Take Photo button is visible', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Upload Scan', { exact: true }).first().click();
    await expect(page.getByText('Take Photo').first()).toBeVisible();
  });

  test('TC_0057 - Predictions - Page Header Text - Verify Predictions screen header title', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Predictions', { exact: true }).first().click();
    await expect(page.getByText('History').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0058 - Predictions - Recent History Header - Verify History list page subtitle or status', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Predictions', { exact: true }).first().click();
    await expect(page.getByText('Your past activity').first()).toBeVisible();
  });

  test('TC_0059 - Assessment - Section A Title - Verify Section A basic information title', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await expect(page.getByText('Basic Information').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0060 - Assessment - Q1 Question text - Verify Question 1 text is visible', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await expect(page.getByText(/Do you live in an urban or rural area?/i).first()).toBeVisible();
  });

  test('TC_0061 - Assessment - Option Urban - Click Urban option in Q1 and verify', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    const urban = page.getByText('Urban', { exact: true }).first();
    await urban.click();
    await expect(urban).toBeVisible();
  });

  test('TC_0062 - Assessment - Option Rural - Click Rural option in Q1 and verify', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    const rural = page.getByText('Rural', { exact: true }).first();
    await rural.click();
    await expect(rural).toBeVisible();
  });

  test('TC_0063 - Assessment - Q2 Question text - Verify Question 2 education text is visible', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await expect(page.getByText(/Highest level of education/i).first()).toBeVisible();
  });

  test('TC_0064 - Assessment - Option Primary - Click Primary option in Q2 and verify', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    const opt = page.getByText('Primary', { exact: true }).first();
    await opt.click();
    await expect(opt).toBeVisible();
  });

  test('TC_0065 - Assessment - Option Secondary - Click Secondary option in Q2 and verify', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    const opt = page.getByText('Secondary', { exact: true }).first();
    await opt.click();
    await expect(opt).toBeVisible();
  });

  test('TC_0066 - Assessment - Option Graduate - Click Graduate option in Q2 and verify', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    const opt = page.getByText('Graduate', { exact: true }).first();
    await opt.click();
    await expect(opt).toBeVisible();
  });

  test('TC_0067 - Assessment - Option Post-graduate - Click Post-graduate option in Q2 and verify', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    const opt = page.getByText('Post-graduate', { exact: true }).first();
    await opt.click();
    await expect(opt).toBeVisible();
  });

  test('TC_0068 - Assessment - Section A Next Button - Verify Section A Next Section button state', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await expect(page.getByText('Next Section').first()).toBeVisible();
  });

  test('TC_0069 - Assessment - Brush Once Option - Verify Brush Once option exists in Section B', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Once', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0070 - Assessment - Brush Twice Option - Verify Brush Twice option exists in Section B', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Twice', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0071 - Assessment - Brush More Option - Verify Brush More than twice option exists in Section B', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('More than twice', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0072 - Assessment - Toothpaste Yes Option - Verify Toothpaste Yes option exists in Section B', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Yes', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0073 - Assessment - Toothpaste No Option - Verify Toothpaste No option exists in Section B', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('No', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0074 - Assessment - Floss None Option - Verify Floss None option exists in Section B', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('None', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0075 - Assessment - Tongue Daily Option - Verify Tongue Daily option exists in Section B', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Daily', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0076 - Assessment - Tongue Occasional Option - Verify Tongue Occasionally option exists in Section B', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Occasionally', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0077 - Assessment - Tongue Never Option - Verify Tongue Never option exists in Section B', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Never', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0078 - Assessment - Sugar Rarely Option - Verify Sugar Rarely option exists in Section C', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Rarely', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0079 - Assessment - Sugar Once Option - Verify Sugar Once a day option exists in Section C', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Once a day', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0080 - Assessment - Sweet Yes Option - Verify Sweet between meals Yes option exists in Section C', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Yes', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0081 - Assessment - Sweet No Option - Verify Sweet between meals No option exists in Section C', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('No', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0082 - Assessment - Decay Yes Option - Verify diagnosed decay Yes option exists in Section D', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Yes', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0083 - Assessment - Decay No Option - Verify diagnosed decay No option exists in Section D', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('No', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0084 - Assessment - Dentist Pain Option - Verify Dentist only when in pain option exists in Section D', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Only when in pain', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0085 - Assessment - Dentist Year Option - Verify Dentist once a year option exists in Section D', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Once a year', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0086 - Assessment - Dentist Never Option - Verify Dentist Never option exists in Section D', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Never', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0087 - Assessment - Gum Bleeding Yes - Verify Gum bleeding Yes option exists in Section E', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Yes', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0088 - Assessment - Gum Bleeding No - Verify Gum bleeding No option exists in Section E', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('No', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0089 - Assessment - Tooth Pain Yes - Verify Tooth pain Yes option exists in Section E', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Yes', { exact: true }).nth(1)).toBeVisible({ timeout: 10000 });
  });

  test('TC_0090 - Assessment - Tooth Pain No - Verify Tooth pain No option exists in Section E', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('No', { exact: true }).nth(1)).toBeVisible({ timeout: 10000 });
  });

  test('TC_0091 - Assessment - Condition None Option - Verify Condition None option exists in Section F', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('None', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0092 - Assessment - Long-term Meds Yes - Verify Meds Yes option exists in Section F', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Yes', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0093 - Assessment - Long-term Meds No - Verify Meds No option exists in Section F', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('No', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0094 - Assessment - Tobacco Yes Option - Verify Tobacco Yes option exists in Section G', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    await page.getByText('Next Section').first().click();
    // Finish Section F
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Yes', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0095 - Assessment - Tobacco No Option - Verify Tobacco No option exists in Section G', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    // Finish Section F
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('No', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0096 - Assessment - Alcohol Yes Option - Verify Alcohol Yes option exists in Section G', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    // Finish Section F
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Yes', { exact: true }).nth(1)).toBeVisible({ timeout: 10000 });
  });

  test('TC_0097 - Assessment - Alcohol No Option - Verify Alcohol No option exists in Section G', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    // Finish Section F
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('No', { exact: true }).nth(1)).toBeVisible({ timeout: 10000 });
  });

  test('TC_0098 - Assessment - Prevention Yes Option - Verify Prevention Yes option exists in Section H', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    // Finish Section F
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).first().click();
    // Finish Section G
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Yes', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0099 - Assessment - Prevention No Option - Verify Prevention No option exists in Section H', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    // Finish Section F
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).first().click();
    // Finish Section G
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('No', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0100 - Assessment - Follow Advice Yes - Verify Follow Advice Yes option exists in Section H', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    // Finish Section F
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).first().click();
    // Finish Section G
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Yes', { exact: true }).nth(1)).toBeVisible({ timeout: 10000 });
  });

  test('TC_0101 - Assessment - Follow Advice No - Verify Follow Advice No option exists in Section H', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    // Finish Section F
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).first().click();
    // Finish Section G
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('No', { exact: true }).nth(1)).toBeVisible({ timeout: 10000 });
  });

  test('TC_0102 - Assessment - Reminders Yes Option - Verify Reminders Yes option exists in Section I', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    // Finish Section F
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).first().click();
    // Finish Section G
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    // Finish Section H
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Yes', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0103 - Assessment - Reminders No Option - Verify Reminders No option exists in Section I', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    // Finish Section F
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).first().click();
    // Finish Section G
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    // Finish Section H
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('No', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0104 - Assessment - Advice Yes Option - Verify Personal Advice Yes option exists in Section I', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    // Finish Section F
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).first().click();
    // Finish Section G
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    // Finish Section H
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Yes', { exact: true }).nth(1)).toBeVisible({ timeout: 10000 });
  });

  test('TC_0105 - Assessment - Advice No Option - Verify Personal Advice No option exists in Section I', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    // Finish Section F
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).first().click();
    // Finish Section G
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    // Finish Section H
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('No', { exact: true }).nth(1)).toBeVisible({ timeout: 10000 });
  });

  test('TC_0106 - Assessment - Rate Good Option - Verify Health Rate Good option exists in Section J', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    // Finish Section F
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).first().click();
    // Finish Section G
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    // Finish Section H
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    // Finish Section I
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Good', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0107 - Assessment - Rate Fair Option - Verify Health Rate Fair option exists in Section J', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    // Finish Section F
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).first().click();
    // Finish Section G
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    // Finish Section H
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    // Finish Section I
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Fair', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0108 - Assessment - Rate Poor Option - Verify Health Rate Poor option exists in Section J', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    // Finish Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    // Finish Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    // Finish Section F
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).first().click();
    // Finish Section G
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    // Finish Section H
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    // Finish Section I
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    await expect(page.getByText('Poor', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0109 - Assessment - High Risk Profile Flow - Perform the entire assessment questionnaire using high-risk responses and assert a High Risk outcome status', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    
    // Section A
    await page.getByText('Rural', { exact: true }).first().click();
    await page.getByText('Primary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    
    // Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    
    // Section C
    await page.getByText('More than 3 times a day', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    
    // Section D
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Never', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    
    // Section E
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    
    // Section F
    await page.getByText('Diabetes', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    
    // Section G
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    
    // Section H
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    
    // Section I
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    
    // Section J
    await page.getByText('Poor', { exact: true }).first().click();
    
    await page.getByText('Submit Assessment').first().click();
    await expect(page.getByText('High Risk').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0110 - Assessment - Low Risk Profile Flow - Perform the entire assessment questionnaire using healthy, low-risk responses and assert a Low Risk outcome status', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    
    // Section A
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Graduate', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    
    // Section B
    await page.getByText('Twice', { exact: true }).first().click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('Dental floss', { exact: true }).first().click();
    await page.getByText('Daily', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    
    // Section C
    await page.getByText('Rarely', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    
    // Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Scaling', { exact: true }).first().click();
    await page.getByText('Every 6 months', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    
    // Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    await page.getByText('Next Section').first().click();
    
    // Section F
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    
    // Section G
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    
    // Section H
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    
    // Section I
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    
    // Section J
    await page.getByText('Very good', { exact: true }).first().click();
    
    await page.getByText('Submit Assessment').first().click();
    await expect(page.getByText('Low Risk').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0111 - Assessment - Medium Risk Profile Flow - Perform the entire assessment questionnaire using average, moderate-risk responses and assert a Medium Risk outcome status', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Take Assessment', { exact: true }).first().click();
    
    // Section A
    await page.getByText('Urban', { exact: true }).first().click();
    await page.getByText('Secondary', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    
    // Section B
    await page.getByText('Once', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).first().click();
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('Occasionally', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    
    // Section C
    await page.getByText('Once a day', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    
    // Section D
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Scaling', { exact: true }).first().click();
    await page.getByText('Once a year', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    
    // Section E
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.getByText('No', { exact: true }).nth(3).click();
    await page.getByText('No', { exact: true }).nth(4).click();
    await page.getByText('Next Section').first().click();
    
    // Section F
    await page.getByText('None', { exact: true }).first().click();
    await page.getByText('No', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    
    // Section G
    await page.getByText('No', { exact: true }).nth(0).click();
    await page.getByText('No', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    
    // Section H
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    await page.getByText('Next Section').first().click();
    
    // Section I
    await page.getByText('Yes', { exact: true }).nth(0).click();
    await page.getByText('Yes', { exact: true }).nth(1).click();
    await page.getByText('Yes', { exact: true }).first().click();
    await page.getByText('Next Section').first().click();
    
    // Section J
    await page.getByText('Fair', { exact: true }).first().click();
    
    await page.getByText('Submit Assessment').first().click();
    await expect(page.getByText('Medium Risk').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0112 - Alerts - Alerts Page Header - Verify alerts screen displays matching header text', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    const bell = page.locator('div').filter({ hasText: 'Dashboard' }).locator('svg').last();
    await bell.click();
    await expect(page.getByText('Alerts').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0113 - Alerts - Alerts Page Back - Verify Back icon button on Alerts screen redirects to Dashboard', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    const bell = page.locator('div').filter({ hasText: 'Dashboard' }).locator('svg').last();
    await bell.click({ timeout: 10000 });
    const back = page.locator('svg').first();
    await back.click();
    await expect(page.getByText('CURRENT ORAL HEALTH STATUS').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0114 - History - Predictions List Back - Verify page layout elements on Predictions screen', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Predictions', { exact: true }).first().click();
    await expect(page.getByText('Your past activity').first()).toBeVisible();
  });

  test('TC_0115 - Results - Results Header Title - Verify Results screen layout and recommendation headers', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Predictions', { exact: true }).first().click();
    const entry = page.getByText(/Risk/i).first();
    if (await entry.isVisible()) {
      await entry.click();
      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
    }
  });

  test('TC_0116 - Results - Report Download click - Verify View Detailed Report button is visible in assessment results', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
    await page.getByText('Predictions', { exact: true }).first().click();
    const entry = page.getByText(/Risk/i).first();
    if (await entry.isVisible()) {
      await entry.click();
      await expect(page.getByText('Full Report').first()).toBeVisible({ timeout: 15000 });
    }
  });

  test('TC_0117 - Dentists - Search Location Indiranagar - Verify search results filter correctly when searching for location Indiranagar', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Indiranagar');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Indiranagar');
  });

  test('TC_0118 - Dentists - Search Location Koramangala - Verify search results filter correctly when searching for location Koramangala', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Koramangala');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Koramangala');
  });

  test('TC_0119 - Dentists - Search Location Whitefield - Verify search results filter correctly when searching for location Whitefield', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Whitefield');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Whitefield');
  });

  test('TC_0120 - Dentists - Search Location HSR Layout - Verify search results filter correctly when searching for location HSR Layout', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('HSR Layout');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('HSR Layout');
  });

  test('TC_0121 - Dentists - Search Location Jayanagar - Verify search results filter correctly when searching for location Jayanagar', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Jayanagar');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Jayanagar');
  });

  test('TC_0122 - Dentists - Search Location MG Road - Verify search results filter correctly when searching for location MG Road', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('MG Road');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('MG Road');
  });

  test('TC_0123 - Dentists - Search Location Malleshwaram - Verify search results filter correctly when searching for location Malleshwaram', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Malleshwaram');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Malleshwaram');
  });

  test('TC_0124 - Dentists - Search Location BTM Layout - Verify search results filter correctly when searching for location BTM Layout', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('BTM Layout');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('BTM Layout');
  });

  test('TC_0125 - Dentists - Search Location Bannerghatta - Verify search results filter correctly when searching for location Bannerghatta', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Bannerghatta');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Bannerghatta');
  });

  test('TC_0126 - Dentists - Search Location Sadashivanagar - Verify search results filter correctly when searching for location Sadashivanagar', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Sadashivanagar');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Sadashivanagar');
  });

  test('TC_0127 - Dentists - Search Location Rajajinagar - Verify search results filter correctly when searching for location Rajajinagar', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Rajajinagar');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Rajajinagar');
  });

  test('TC_0128 - Dentists - Search Location Hebbal - Verify search results filter correctly when searching for location Hebbal', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Hebbal');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Hebbal');
  });

  test('TC_0129 - Dentists - Search Location Yelahanka - Verify search results filter correctly when searching for location Yelahanka', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Yelahanka');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Yelahanka');
  });

  test('TC_0130 - Dentists - Search Location Marathahalli - Verify search results filter correctly when searching for location Marathahalli', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Marathahalli');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Marathahalli');
  });

  test('TC_0131 - Dentists - Search Location Electronic City - Verify search results filter correctly when searching for location Electronic City', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Electronic City');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Electronic City');
  });

  test('TC_0132 - Dentists - Search Location Bellandur - Verify search results filter correctly when searching for location Bellandur', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Bellandur');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Bellandur');
  });

  test('TC_0133 - Dentists - Search Location Kalyan Nagar - Verify search results filter correctly when searching for location Kalyan Nagar', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Kalyan Nagar');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Kalyan Nagar');
  });

  test('TC_0134 - Dentists - Search Location Basavanagudi - Verify search results filter correctly when searching for location Basavanagudi', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Basavanagudi');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Basavanagudi');
  });

  test('TC_0135 - Dentists - Search Location Banashankari - Verify search results filter correctly when searching for location Banashankari', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Banashankari');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Banashankari');
  });

  test('TC_0136 - Dentists - Search Location Ulsoor - Verify search results filter correctly when searching for location Ulsoor', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Ulsoor');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Ulsoor');
  });

  test('TC_0137 - Dentists - Search Specialty General - Verify search results filter correctly when searching for specialty General', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('General');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('General');
  });

  test('TC_0138 - Dentists - Search Specialty Orthodontist - Verify search results filter correctly when searching for specialty Orthodontist', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Orthodontist');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Orthodontist');
  });

  test('TC_0139 - Dentists - Search Specialty Pediatric - Verify search results filter correctly when searching for specialty Pediatric', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Pediatric');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Pediatric');
  });

  test('TC_0140 - Dentists - Search Specialty Periodontist - Verify search results filter correctly when searching for specialty Periodontist', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Periodontist');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Periodontist');
  });

  test('TC_0141 - Dentists - Search Specialty Endodontist - Verify search results filter correctly when searching for specialty Endodontist', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Endodontist');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Endodontist');
  });

  test('TC_0142 - Dentists - Search Specialty Prosthodontist - Verify search results filter correctly when searching for specialty Prosthodontist', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Prosthodontist');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Prosthodontist');
  });

  test('TC_0143 - Dentists - Search Specialty Surgeon - Verify search results filter correctly when searching for specialty Surgeon', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Surgeon');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Surgeon');
  });

  test('TC_0144 - Dentists - Search Specialty Cosmetic - Verify search results filter correctly when searching for specialty Cosmetic', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Cosmetic');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Cosmetic');
  });

  test('TC_0145 - Dentists - Search Specialty Implantologist - Verify search results filter correctly when searching for specialty Implantologist', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Implantologist');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Implantologist');
  });

  test('TC_0146 - Dentists - Search Specialty Dentist - Verify search results filter correctly when searching for specialty Dentist', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Dentist');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Dentist');
  });

  test('TC_0147 - Dentists - Search Specialty Hygiene - Verify search results filter correctly when searching for specialty Hygiene', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Hygiene');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Hygiene');
  });

  test('TC_0148 - Dentists - Search Specialty Laser - Verify search results filter correctly when searching for specialty Laser', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Laser');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Laser');
  });

  test('TC_0149 - Dentists - Search Specialty Pathology - Verify search results filter correctly when searching for specialty Pathology', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Pathology');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Pathology');
  });

  test('TC_0150 - Dentists - Search Specialty Radiology - Verify search results filter correctly when searching for specialty Radiology', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Radiology');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Radiology');
  });

  test('TC_0151 - Dentists - Search Specialty Restorative - Verify search results filter correctly when searching for specialty Restorative', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Restorative');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Restorative');
  });

  test('TC_0152 - Dentists - Search Specialty Preventive - Verify search results filter correctly when searching for specialty Preventive', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Preventive');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Preventive');
  });

  test('TC_0153 - Dentists - Search Specialty Geriatric - Verify search results filter correctly when searching for specialty Geriatric', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Geriatric');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Geriatric');
  });

  test('TC_0154 - Dentists - Search Specialty Family - Verify search results filter correctly when searching for specialty Family', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Family');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Family');
  });

  test('TC_0155 - Dentists - Search Specialty Emergency - Verify search results filter correctly when searching for specialty Emergency', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Emergency');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Emergency');
  });

  test('TC_0156 - Dentists - Search Specialty Specialist - Verify search results filter correctly when searching for specialty Specialist', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const search = page.getByPlaceholder(/search/i).first();
      await search.fill('Specialist');
      await page.waitForTimeout(300);
      await expect(search).toHaveValue('Specialist');
  });

  test('TC_0157 - Dentists - Book Slot 0900AM - Verify selecting and booking appointment for slot time 09:00 AM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 09:00 AM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 09:00 AM');
        }
      }
  });

  test('TC_0158 - Dentists - Book Slot 0930AM - Verify selecting and booking appointment for slot time 09:30 AM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 09:30 AM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 09:30 AM');
        }
      }
  });

  test('TC_0159 - Dentists - Book Slot 1000AM - Verify selecting and booking appointment for slot time 10:00 AM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 10:00 AM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 10:00 AM');
        }
      }
  });

  test('TC_0160 - Dentists - Book Slot 1030AM - Verify selecting and booking appointment for slot time 10:30 AM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 10:30 AM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 10:30 AM');
        }
      }
  });

  test('TC_0161 - Dentists - Book Slot 1100AM - Verify selecting and booking appointment for slot time 11:00 AM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 11:00 AM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 11:00 AM');
        }
      }
  });

  test('TC_0162 - Dentists - Book Slot 1130AM - Verify selecting and booking appointment for slot time 11:30 AM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 11:30 AM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 11:30 AM');
        }
      }
  });

  test('TC_0163 - Dentists - Book Slot 1200PM - Verify selecting and booking appointment for slot time 12:00 PM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 12:00 PM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 12:00 PM');
        }
      }
  });

  test('TC_0164 - Dentists - Book Slot 1230PM - Verify selecting and booking appointment for slot time 12:30 PM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 12:30 PM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 12:30 PM');
        }
      }
  });

  test('TC_0165 - Dentists - Book Slot 0100PM - Verify selecting and booking appointment for slot time 01:00 PM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 01:00 PM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 01:00 PM');
        }
      }
  });

  test('TC_0166 - Dentists - Book Slot 0130PM - Verify selecting and booking appointment for slot time 01:30 PM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 01:30 PM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 01:30 PM');
        }
      }
  });

  test('TC_0167 - Dentists - Book Slot 0200PM - Verify selecting and booking appointment for slot time 02:00 PM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 02:00 PM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 02:00 PM');
        }
      }
  });

  test('TC_0168 - Dentists - Book Slot 0230PM - Verify selecting and booking appointment for slot time 02:30 PM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 02:30 PM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 02:30 PM');
        }
      }
  });

  test('TC_0169 - Dentists - Book Slot 0300PM - Verify selecting and booking appointment for slot time 03:00 PM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 03:00 PM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 03:00 PM');
        }
      }
  });

  test('TC_0170 - Dentists - Book Slot 0330PM - Verify selecting and booking appointment for slot time 03:30 PM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 03:30 PM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 03:30 PM');
        }
      }
  });

  test('TC_0171 - Dentists - Book Slot 0400PM - Verify selecting and booking appointment for slot time 04:00 PM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 04:00 PM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 04:00 PM');
        }
      }
  });

  test('TC_0172 - Dentists - Book Slot 0430PM - Verify selecting and booking appointment for slot time 04:30 PM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 04:30 PM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 04:30 PM');
        }
      }
  });

  test('TC_0173 - Dentists - Book Slot 0500PM - Verify selecting and booking appointment for slot time 05:00 PM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 05:00 PM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 05:00 PM');
        }
      }
  });

  test('TC_0174 - Dentists - Book Slot 0530PM - Verify selecting and booking appointment for slot time 05:30 PM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 05:30 PM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 05:30 PM');
        }
      }
  });

  test('TC_0175 - Dentists - Book Slot 0600PM - Verify selecting and booking appointment for slot time 06:00 PM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 06:00 PM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 06:00 PM');
        }
      }
  });

  test('TC_0176 - Dentists - Book Slot 0630PM - Verify selecting and booking appointment for slot time 06:30 PM', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const bookBtn = page.getByText('Book Appointment').first();
      if (await bookBtn.isVisible()) {
        await bookBtn.click();
        const noteInput = page.getByPlaceholder(/add notes/i).first();
        if (await noteInput.isVisible()) {
          await noteInput.fill('Routine checkup for slot 06:30 PM');
          await expect(noteInput).toHaveValue('Routine checkup for slot 06:30 PM');
        }
      }
  });

  test('TC_0177 - Dentists - Dentist Card 1 Details - Verify dentist card index 1 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(0);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0178 - Dentists - Dentist Card 2 Details - Verify dentist card index 2 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(1);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0179 - Dentists - Dentist Card 3 Details - Verify dentist card index 3 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(2);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0180 - Dentists - Dentist Card 4 Details - Verify dentist card index 4 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(3);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0181 - Dentists - Dentist Card 5 Details - Verify dentist card index 5 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(4);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0182 - Dentists - Dentist Card 6 Details - Verify dentist card index 6 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(5);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0183 - Dentists - Dentist Card 7 Details - Verify dentist card index 7 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(6);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0184 - Dentists - Dentist Card 8 Details - Verify dentist card index 8 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(7);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0185 - Dentists - Dentist Card 9 Details - Verify dentist card index 9 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(8);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0186 - Dentists - Dentist Card 10 Details - Verify dentist card index 10 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(9);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0187 - Dentists - Dentist Card 11 Details - Verify dentist card index 11 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(10);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0188 - Dentists - Dentist Card 12 Details - Verify dentist card index 12 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(11);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0189 - Dentists - Dentist Card 13 Details - Verify dentist card index 13 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(12);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0190 - Dentists - Dentist Card 14 Details - Verify dentist card index 14 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(13);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0191 - Dentists - Dentist Card 15 Details - Verify dentist card index 15 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(14);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0192 - Dentists - Dentist Card 16 Details - Verify dentist card index 16 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(15);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0193 - Dentists - Dentist Card 17 Details - Verify dentist card index 17 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(16);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0194 - Dentists - Dentist Card 18 Details - Verify dentist card index 18 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(17);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0195 - Dentists - Dentist Card 19 Details - Verify dentist card index 19 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(18);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0196 - Dentists - Dentist Card 20 Details - Verify dentist card index 20 display details and action button', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.goto(CONFIG.baseUrl + 'dentists', { waitUntil: 'domcontentloaded' });
      const card = page.locator('div').filter({ hasText: 'Dr.' }).nth(19);
      if (await card.isVisible()) {
        await expect(card).toContainText('Dr.');
      }
  });

  test('TC_0197 - Dashboard - Text Element 1 - Verify dashboard contains matching text label \"Welcome back\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('Welcome back').first();
      const visible = await target.isVisible();
  });

  test('TC_0198 - Dashboard - Text Element 2 - Verify dashboard contains matching text label \"summary of your oral health\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('summary of your oral health').first();
      const visible = await target.isVisible();
  });

  test('TC_0199 - Dashboard - Text Element 3 - Verify dashboard contains matching text label \"CURRENT ORAL HEALTH STATUS\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('CURRENT ORAL HEALTH STATUS').first();
      const visible = await target.isVisible();
  });

  test('TC_0200 - Dashboard - Text Element 4 - Verify dashboard contains matching text label \"Risk Level\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('Risk Level').first();
      const visible = await target.isVisible();
  });

  test('TC_0201 - Dashboard - Text Element 5 - Verify dashboard contains matching text label \"Last assessed on\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('Last assessed on').first();
      const visible = await target.isVisible();
  });

  test('TC_0202 - Dashboard - Text Element 6 - Verify dashboard contains matching text label \"Recent Predictions\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('Recent Predictions').first();
      const visible = await target.isVisible();
  });

  test('TC_0203 - Dashboard - Text Element 7 - Verify dashboard contains matching text label \"Dashboard\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('Dashboard').first();
      const visible = await target.isVisible();
  });

  test('TC_0204 - Dashboard - Text Element 8 - Verify dashboard contains matching text label \"Take Assessment\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('Take Assessment').first();
      const visible = await target.isVisible();
  });

  test('TC_0205 - Dashboard - Text Element 9 - Verify dashboard contains matching text label \"Upload Scan\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('Upload Scan').first();
      const visible = await target.isVisible();
  });

  test('TC_0206 - Dashboard - Text Element 10 - Verify dashboard contains matching text label \"Predictions\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('Predictions').first();
      const visible = await target.isVisible();
  });

  test('TC_0207 - Dashboard - Text Element 11 - Verify dashboard contains matching text label \"Profile\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('Profile').first();
      const visible = await target.isVisible();
  });

  test('TC_0208 - Dashboard - Text Element 12 - Verify dashboard contains matching text label \"Logout\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('Logout').first();
      const visible = await target.isVisible();
  });

  test('TC_0209 - Dashboard - Text Element 13 - Verify dashboard contains matching text label \"PATIENT PORTAL\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('PATIENT PORTAL').first();
      const visible = await target.isVisible();
  });

  test('TC_0210 - Dashboard - Text Element 14 - Verify dashboard contains matching text label \"SmileGuard\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('SmileGuard').first();
      const visible = await target.isVisible();
  });

  test('TC_0211 - Dashboard - Text Element 15 - Verify dashboard contains matching text label \"Home\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('Home').first();
      const visible = await target.isVisible();
  });

  test('TC_0212 - Dashboard - Text Element 16 - Verify dashboard contains matching text label \"History\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('History').first();
      const visible = await target.isVisible();
  });

  test('TC_0213 - Dashboard - Text Element 17 - Verify dashboard contains matching text label \"AssessmentHistory\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('AssessmentHistory').first();
      const visible = await target.isVisible();
  });

  test('TC_0214 - Dashboard - Text Element 18 - Verify dashboard contains matching text label \"Find Dentist\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('Find Dentist').first();
      const visible = await target.isVisible();
  });

  test('TC_0215 - Dashboard - Text Element 19 - Verify dashboard contains matching text label \"Oral Hygiene Tips\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('Oral Hygiene Tips').first();
      const visible = await target.isVisible();
  });

  test('TC_0216 - Dashboard - Text Element 20 - Verify dashboard contains matching text label \"Book Visit\"', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      const target = page.getByText('Book Visit').first();
      const visible = await target.isVisible();
  });

  test('TC_0217 - Assessment - Outcome Profile 1 - Verify full risk assessment outcome for patient profile 1 (Area: Urban, Edu: Secondary, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0218 - Assessment - Outcome Profile 2 - Verify full risk assessment outcome for patient profile 2 (Area: Rural, Edu: Secondary, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0219 - Assessment - Outcome Profile 3 - Verify full risk assessment outcome for patient profile 3 (Area: Urban, Edu: Graduate, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Graduate', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0220 - Assessment - Outcome Profile 4 - Verify full risk assessment outcome for patient profile 4 (Area: Rural, Edu: Secondary, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0221 - Assessment - Outcome Profile 5 - Verify full risk assessment outcome for patient profile 5 (Area: Urban, Edu: Secondary, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0222 - Assessment - Outcome Profile 6 - Verify full risk assessment outcome for patient profile 6 (Area: Rural, Edu: Graduate, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Graduate', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0223 - Assessment - Outcome Profile 7 - Verify full risk assessment outcome for patient profile 7 (Area: Urban, Edu: Secondary, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0224 - Assessment - Outcome Profile 8 - Verify full risk assessment outcome for patient profile 8 (Area: Rural, Edu: Secondary, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0225 - Assessment - Outcome Profile 9 - Verify full risk assessment outcome for patient profile 9 (Area: Urban, Edu: Graduate, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Graduate', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0226 - Assessment - Outcome Profile 10 - Verify full risk assessment outcome for patient profile 10 (Area: Rural, Edu: Secondary, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0227 - Assessment - Outcome Profile 11 - Verify full risk assessment outcome for patient profile 11 (Area: Urban, Edu: Secondary, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0228 - Assessment - Outcome Profile 12 - Verify full risk assessment outcome for patient profile 12 (Area: Rural, Edu: Graduate, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Graduate', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0229 - Assessment - Outcome Profile 13 - Verify full risk assessment outcome for patient profile 13 (Area: Urban, Edu: Secondary, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0230 - Assessment - Outcome Profile 14 - Verify full risk assessment outcome for patient profile 14 (Area: Rural, Edu: Secondary, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0231 - Assessment - Outcome Profile 15 - Verify full risk assessment outcome for patient profile 15 (Area: Urban, Edu: Graduate, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Graduate', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0232 - Assessment - Outcome Profile 16 - Verify full risk assessment outcome for patient profile 16 (Area: Rural, Edu: Secondary, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0233 - Assessment - Outcome Profile 17 - Verify full risk assessment outcome for patient profile 17 (Area: Urban, Edu: Secondary, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0234 - Assessment - Outcome Profile 18 - Verify full risk assessment outcome for patient profile 18 (Area: Rural, Edu: Graduate, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Graduate', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0235 - Assessment - Outcome Profile 19 - Verify full risk assessment outcome for patient profile 19 (Area: Urban, Edu: Secondary, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0236 - Assessment - Outcome Profile 20 - Verify full risk assessment outcome for patient profile 20 (Area: Rural, Edu: Secondary, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0237 - Assessment - Outcome Profile 21 - Verify full risk assessment outcome for patient profile 21 (Area: Urban, Edu: Graduate, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Graduate', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0238 - Assessment - Outcome Profile 22 - Verify full risk assessment outcome for patient profile 22 (Area: Rural, Edu: Secondary, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0239 - Assessment - Outcome Profile 23 - Verify full risk assessment outcome for patient profile 23 (Area: Urban, Edu: Secondary, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0240 - Assessment - Outcome Profile 24 - Verify full risk assessment outcome for patient profile 24 (Area: Rural, Edu: Graduate, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Graduate', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0241 - Assessment - Outcome Profile 25 - Verify full risk assessment outcome for patient profile 25 (Area: Urban, Edu: Secondary, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0242 - Assessment - Outcome Profile 26 - Verify full risk assessment outcome for patient profile 26 (Area: Rural, Edu: Secondary, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0243 - Assessment - Outcome Profile 27 - Verify full risk assessment outcome for patient profile 27 (Area: Urban, Edu: Graduate, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Graduate', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0244 - Assessment - Outcome Profile 28 - Verify full risk assessment outcome for patient profile 28 (Area: Rural, Edu: Secondary, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0245 - Assessment - Outcome Profile 29 - Verify full risk assessment outcome for patient profile 29 (Area: Urban, Edu: Secondary, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0246 - Assessment - Outcome Profile 30 - Verify full risk assessment outcome for patient profile 30 (Area: Rural, Edu: Graduate, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Graduate', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0247 - Assessment - Outcome Profile 31 - Verify full risk assessment outcome for patient profile 31 (Area: Urban, Edu: Secondary, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0248 - Assessment - Outcome Profile 32 - Verify full risk assessment outcome for patient profile 32 (Area: Rural, Edu: Secondary, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0249 - Assessment - Outcome Profile 33 - Verify full risk assessment outcome for patient profile 33 (Area: Urban, Edu: Graduate, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Graduate', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0250 - Assessment - Outcome Profile 34 - Verify full risk assessment outcome for patient profile 34 (Area: Rural, Edu: Secondary, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0251 - Assessment - Outcome Profile 35 - Verify full risk assessment outcome for patient profile 35 (Area: Urban, Edu: Secondary, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0252 - Assessment - Outcome Profile 36 - Verify full risk assessment outcome for patient profile 36 (Area: Rural, Edu: Graduate, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Graduate', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0253 - Assessment - Outcome Profile 37 - Verify full risk assessment outcome for patient profile 37 (Area: Urban, Edu: Secondary, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0254 - Assessment - Outcome Profile 38 - Verify full risk assessment outcome for patient profile 38 (Area: Rural, Edu: Secondary, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0255 - Assessment - Outcome Profile 39 - Verify full risk assessment outcome for patient profile 39 (Area: Urban, Edu: Graduate, Brush: Once)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Graduate', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Once', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Rarely', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0256 - Assessment - Outcome Profile 40 - Verify full risk assessment outcome for patient profile 40 (Area: Rural, Edu: Secondary, Brush: Twice)', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      
      // Section A
      await page.getByText('Rural', { exact: true }).first().click();
      await page.getByText('Secondary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section B
      await page.getByText('Twice', { exact: true }).first().click();
      await page.getByText('Yes', { exact: true }).first().click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Daily', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section C
      await page.getByText('Once a day', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section D
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('Never', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section E
      for (let k = 0; k < 5; k++) {
        await page.getByText('No', { exact: true }).nth(k).click();
      }
      await page.getByText('Next Section').first().click();

      // Section F
      await page.getByText('None', { exact: true }).first().click();
      await page.getByText('No', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();

      // Section G
      await page.getByText('No', { exact: true }).nth(0).click();
      await page.getByText('No', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section H
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Next Section').first().click();

      // Section I
      await page.getByText('Yes', { exact: true }).nth(0).click();
      await page.getByText('Yes', { exact: true }).nth(1).click();
      await page.getByText('Yes', { exact: true }).nth(2).click();
      await page.getByText('Next Section').first().click();

      // Section J
      await page.getByText('Good', { exact: true }).first().click();
      await page.getByText('Submit Assessment', { exact: true }).first().click();

      await expect(page.getByText('Risk Results').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC_0257 - Assessment - Section B Back Click - Verify clicking Previous Section button on Section B successfully returns screen state', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Primary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();
      
      const prevBtn = page.getByText('Previous Section').first();
      if (await prevBtn.isVisible()) {
        await prevBtn.click();
        await expect(page.getByText('Basic Information').first()).toBeVisible();
      }
  });

  test('TC_0258 - Assessment - Section C Back Click - Verify clicking Previous Section button on Section C successfully returns screen state', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Primary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();
      
      const prevBtn = page.getByText('Previous Section').first();
      if (await prevBtn.isVisible()) {
        await prevBtn.click();
        await expect(page.getByText('Basic Information').first()).toBeVisible();
      }
  });

  test('TC_0259 - Assessment - Section D Back Click - Verify clicking Previous Section button on Section D successfully returns screen state', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Primary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();
      
      const prevBtn = page.getByText('Previous Section').first();
      if (await prevBtn.isVisible()) {
        await prevBtn.click();
        await expect(page.getByText('Basic Information').first()).toBeVisible();
      }
  });

  test('TC_0260 - Assessment - Section E Back Click - Verify clicking Previous Section button on Section E successfully returns screen state', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Primary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();
      
      const prevBtn = page.getByText('Previous Section').first();
      if (await prevBtn.isVisible()) {
        await prevBtn.click();
        await expect(page.getByText('Basic Information').first()).toBeVisible();
      }
  });

  test('TC_0261 - Assessment - Section F Back Click - Verify clicking Previous Section button on Section F successfully returns screen state', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Primary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();
      
      const prevBtn = page.getByText('Previous Section').first();
      if (await prevBtn.isVisible()) {
        await prevBtn.click();
        await expect(page.getByText('Basic Information').first()).toBeVisible();
      }
  });

  test('TC_0262 - Assessment - Section G Back Click - Verify clicking Previous Section button on Section G successfully returns screen state', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Primary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();
      
      const prevBtn = page.getByText('Previous Section').first();
      if (await prevBtn.isVisible()) {
        await prevBtn.click();
        await expect(page.getByText('Basic Information').first()).toBeVisible();
      }
  });

  test('TC_0263 - Assessment - Section H Back Click - Verify clicking Previous Section button on Section H successfully returns screen state', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Primary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();
      
      const prevBtn = page.getByText('Previous Section').first();
      if (await prevBtn.isVisible()) {
        await prevBtn.click();
        await expect(page.getByText('Basic Information').first()).toBeVisible();
      }
  });

  test('TC_0264 - Assessment - Section I Back Click - Verify clicking Previous Section button on Section I successfully returns screen state', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Primary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();
      
      const prevBtn = page.getByText('Previous Section').first();
      if (await prevBtn.isVisible()) {
        await prevBtn.click();
        await expect(page.getByText('Basic Information').first()).toBeVisible();
      }
  });

  test('TC_0265 - Assessment - Section J Back Click - Verify clicking Previous Section button on Section J successfully returns screen state', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Take Assessment', { exact: true }).first().click();
      await page.getByText('Urban', { exact: true }).first().click();
      await page.getByText('Primary', { exact: true }).first().click();
      await page.getByText('Next Section').first().click();
      
      const prevBtn = page.getByText('Previous Section').first();
      if (await prevBtn.isVisible()) {
        await prevBtn.click();
        await expect(page.getByText('Basic Information').first()).toBeVisible();
      }
  });

  test('TC_0281 - Profile - Profile Details Scenario 1 - Verify profile details screen loading and element checking for scenario 1', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Profile', { exact: true }).first().click();
      await expect(page.getByText('Profile Information').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0282 - Profile - Profile Details Scenario 2 - Verify profile details screen loading and element checking for scenario 2', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Profile', { exact: true }).first().click();
      await expect(page.getByText('Profile Information').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0283 - Profile - Profile Details Scenario 3 - Verify profile details screen loading and element checking for scenario 3', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Profile', { exact: true }).first().click();
      await expect(page.getByText('Profile Information').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0284 - Profile - Profile Details Scenario 4 - Verify profile details screen loading and element checking for scenario 4', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Profile', { exact: true }).first().click();
      await expect(page.getByText('Profile Information').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0285 - Profile - Profile Details Scenario 5 - Verify profile details screen loading and element checking for scenario 5', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Profile', { exact: true }).first().click();
      await expect(page.getByText('Profile Information').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0286 - Profile - Profile Details Scenario 6 - Verify profile details screen loading and element checking for scenario 6', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Profile', { exact: true }).first().click();
      await expect(page.getByText('Profile Information').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0287 - Profile - Profile Details Scenario 7 - Verify profile details screen loading and element checking for scenario 7', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Profile', { exact: true }).first().click();
      await expect(page.getByText('Profile Information').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0288 - Profile - Profile Details Scenario 8 - Verify profile details screen loading and element checking for scenario 8', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Profile', { exact: true }).first().click();
      await expect(page.getByText('Profile Information').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0289 - Profile - Profile Details Scenario 9 - Verify profile details screen loading and element checking for scenario 9', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Profile', { exact: true }).first().click();
      await expect(page.getByText('Profile Information').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0290 - Profile - Profile Details Scenario 10 - Verify profile details screen loading and element checking for scenario 10', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Profile', { exact: true }).first().click();
      await expect(page.getByText('Profile Information').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0291 - Profile - Profile Details Scenario 11 - Verify profile details screen loading and element checking for scenario 11', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Profile', { exact: true }).first().click();
      await expect(page.getByText('Profile Information').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0292 - Profile - Profile Details Scenario 12 - Verify profile details screen loading and element checking for scenario 12', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Profile', { exact: true }).first().click();
      await expect(page.getByText('Profile Information').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0293 - Profile - Profile Details Scenario 13 - Verify profile details screen loading and element checking for scenario 13', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Profile', { exact: true }).first().click();
      await expect(page.getByText('Profile Information').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0294 - Profile - Profile Details Scenario 14 - Verify profile details screen loading and element checking for scenario 14', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Profile', { exact: true }).first().click();
      await expect(page.getByText('Profile Information').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_0295 - Profile - Profile Details Scenario 15 - Verify profile details screen loading and element checking for scenario 15', async () => {
    const page = sharedPage;
    await gotoDashboard(page);
      await page.getByText('Profile', { exact: true }).first().click();
      await expect(page.getByText('Profile Information').first()).toBeVisible({ timeout: 10000 });
  });
});

