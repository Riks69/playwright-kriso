/**
 * Part II — Page Object Model tests
 * Test suite: Navigate Products via Filters
 */
import { test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe.configure({ mode: 'serial' });

let homePage: HomePage;

test.describe('Navigate Products via Filters (POM)', () => {

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    homePage = new HomePage(page);
    await homePage.openUrl();
    // await homePage.acceptCookies();
  });

  test.afterAll(async () => {
    await homePage.close?.();
  });

  test('Test logo is visible', async () => {
    await homePage.verifyLogo();
  });

  test('Test scroll to "Muusikaraamatud ja noodid" section', async () => {
    await homePage.scrollToSection('Muusikaraamatud ja noodid');
  });

  test('Test click "Kitarr" category', async () => {
    await homePage.clickKitarrCategory();
  });

  test('Test URL reflects navigation correctly', async () => {
    await homePage.verifyUrlContains('instrument=Guitar');
  });

  test('Test filter by language English', async () => {
    await homePage.filterByLanguage('Inglise');
  });

  test('Test filter by format CD', async () => {
    await homePage.filterByFormat('CD');
  });

  test('Test remove all filters', async () => {
    await homePage.removeAllFilters();
  });
});