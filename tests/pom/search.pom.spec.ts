/**
 * Part II — Page Object Model tests
 * Test suite: Search for Books by Keywords
 */
import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe.configure({ mode: 'serial' });

let homePage: HomePage;

test.describe('Search for Books by Keywords (POM)', () => {

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    homePage = new HomePage(page);
    await homePage.openUrl();
    // Küpsiste nõusolek on kommenteeritud - ei põhjusta probleeme
  });

  test.afterAll(async () => {
    await homePage.close?.();
  });

  test('Test logo is visible', async () => {
    await homePage.verifyLogo();
  });

  test('Test no products found for invalid keyword', async () => {
    await homePage.searchByKeyword('xqzwmfkj');
    await homePage.verifyNoProductsFoundMessage();
  });

  test('Test search results contain keyword "tolkien"', async () => {
    await homePage.searchByKeyword('tolkien');
    await homePage.verifyResultsCountMoreThan(1);
  });

  test('Test search by ISBN shows "Gone Girl"', async () => {
    await homePage.searchByKeyword('9780307588371');
    await homePage.verifyGoneGirlBookIsVisible();
  });
});