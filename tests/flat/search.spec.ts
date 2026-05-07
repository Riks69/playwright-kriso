/**
 * Part I — Flat tests (no POM)
 * Test suite: Search for Books by Keywords
 *
 * Rules:
 *   - Use only: getByRole, getByText, getByPlaceholder, getByLabel
 *   - No CSS class selectors, no XPath
 */
import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page: Page;

test.describe('Search for Books by Keywords', () => {

    test.beforeAll(async ({ browser }) => {
      const context = await browser.newContext();
      page = await context.newPage();
  
      await page.goto('https://www.kriso.ee/');
      
      const consentButton = page.getByRole('button', { name: /Nõustun|Accept|OK/i });
      if (await consentButton.isVisible()) {
        await consentButton.click();
      }
    });
  
    test.afterAll(async () => {
      await page.context().close();
    });

    test('Test logo is visible', async () => {
      const title = await page.title();
      expect(title.toLowerCase()).toContain('kriso');
    }); 

    test('Test no products found for invalid keyword', async () => {
      const searchInput = page.getByRole('textbox', { name: /Pealkiri, autor, ISBN, märksõ|Title, author, ISBN, keyword/i });
      await searchInput.click();
      await searchInput.fill('xqzwmfkj');
      await searchInput.press('Enter');
      
      await page.waitForTimeout(2000);
      
      // PARANDATUD: täpsem veateate otsing
      const errorMessage = page.getByText(/Teie poolt sisestatud märksõnale vastavat raamatut ei leitud|The search did not find any match for your search criteria/i);
      await expect(errorMessage).toBeVisible({ timeout: 10000 });
    });

    test('Test search results contain keyword "tolkien"', async () => {
      const searchInput = page.getByRole('textbox', { name: /Pealkiri, autor, ISBN, märksõ|Title, author, ISBN, keyword/i });
      await searchInput.click();
      await searchInput.fill('tolkien');
      await searchInput.press('Enter');
      
      await page.waitForTimeout(3000);
      
      const tolkienText = page.getByText(/Tolkien/i);
      await expect(tolkienText.first()).toBeVisible();
      
      const authorLinks = page.getByRole('link', { name: /Tolkien/i });
      const linkCount = await authorLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    });

    test('Test search by ISBN shows "Gone Girl"', async () => {
      const searchInput = page.getByRole('textbox', { name: /Pealkiri, autor, ISBN, märksõ|Title, author, ISBN, keyword/i });
      await searchInput.click();
      await searchInput.fill('9780307588371');
      await searchInput.press('Enter');
      
      await page.waitForTimeout(3000);
      
      const goneGirl = page.getByRole('link', { name: /Gone Girl/i });
      await expect(goneGirl.first()).toBeVisible();
    });
});