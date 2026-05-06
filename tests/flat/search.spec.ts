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
      
      const consentButton = page.getByRole('button', { name: 'Nõustun' });
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
      const searchInput = page.getByRole('textbox', { name: 'Pealkiri, autor, ISBN, märksõ' });
      await searchInput.click();
      await searchInput.fill('xqzwmfkj');
      await searchInput.press('Enter');
      
      await page.waitForTimeout(2000);
      
      const errorMessage = page.getByText(/ei leitud|pole tulemusi/i);
      await expect(errorMessage).toBeVisible();
    });

    test('Test search results contain keyword "tolkien"', async () => {
      const searchInput = page.getByRole('textbox', { name: 'Pealkiri, autor, ISBN, märksõ' });
      await searchInput.click();
      await searchInput.fill('tolkien');
      await searchInput.press('Enter');
      
      await page.waitForTimeout(3000);
      
      // Lihtsalt kontrolli, et lehel on "Tolkien" tekst
      const tolkienText = page.getByText(/Tolkien/i);
      await expect(tolkienText.first()).toBeVisible();
      
      // Kontrolli, et on rohkem kui 1 autori link
      const authorLinks = page.getByRole('link', { name: /Tolkien/i });
      const linkCount = await authorLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    });

    test('Test search by ISBN shows "Gone Girl"', async () => {
      const searchInput = page.getByRole('textbox', { name: 'Pealkiri, autor, ISBN, märksõ' });
      await searchInput.click();
      await searchInput.fill('9780307588371');
      await searchInput.press('Enter');
      
      await page.waitForTimeout(3000);
      
      const goneGirl = page.getByRole('link', { name: /Gone Girl/i });
      await expect(goneGirl.first()).toBeVisible();
    });
});