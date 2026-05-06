import { test, expect } from '@playwright/test';

test('Simple test - just open page', async ({ page }) => {
  console.log('Starting test...');
  await page.goto('https://www.kriso.ee/');
  console.log('Page loaded');
  const title = await page.title();
  console.log('Page title:', title);
  expect(title).toBeTruthy();
  console.log('Test passed!');
});