const { chromium, expect } = require('@playwright/test');
const path = require('path');

const CONFIG = {
  baseUrl: 'http://localhost:8081/',
  email: 'anjalibommisetty20@gmail.com',
  password: 'Anju@12345'
};

async function gotoDashboard(page) {
  await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
  await page.getByText('Get Started', { exact: true }).first().click();
  await page.waitForTimeout(300);
}

const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
  page.on('request', req => console.log('REQ:', req.url()));
  page.on('requestfailed', req => console.log('REQ FAILED:', req.url(), req.failure().errorText));

  console.log('Running test 1 (Splash brand)...');
  const code1 = `
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('SmileGuard').first()).toBeVisible({ timeout: 5000 });
  `;
  const fn1 = new AsyncFunction('page', 'CONFIG', 'expect', 'gotoDashboard', code1);
  try {
    await fn1(page, CONFIG, expect, gotoDashboard);
    console.log('✅ Test 1 Passed!');
  } catch (err) {
    console.error('❌ Test 1 Failed:', err.message);
  }

  console.log('Running test 2 (Login page header)...');
  const code2 = `
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('Get Started').first().click();
    await expect(page.getByText('Login').first()).toBeVisible({ timeout: 5000 });
  `;
  const fn2 = new AsyncFunction('page', 'CONFIG', 'expect', 'gotoDashboard', code2);
  try {
    await fn2(page, CONFIG, expect, gotoDashboard);
    console.log('✅ Test 2 Passed!');
  } catch (err) {
    console.error('❌ Test 2 Failed:', err.message);
  }

  await browser.close();
}

run().catch(console.error);
