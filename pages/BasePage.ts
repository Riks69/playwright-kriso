import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected readonly searchInput: Locator;
  protected readonly searchButton: Locator;

  constructor(protected page: Page) {
    this.searchInput = this.page.getByRole('textbox', { name: 'Pealkiri, autor, ISBN, märksõ' });
    // PARANDATUD: võta esimene otsingunupp
    this.searchButton = this.page.getByRole('button', { name: 'Search' }).first();
  }

  async acceptCookies() {
    const consentButton = this.page.getByRole('button', { name: 'Nõustun' });
    if (await consentButton.isVisible()) {
      await consentButton.click();
    }
  }

  async verifyLogo() {
    const title = await this.page.title();
    expect(title.toLowerCase()).toContain('kriso');
  }

  async searchByKeyword(keyword: string) {
    await this.searchInput.waitFor({ state: 'visible' });
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
    await this.page.waitForTimeout(3000);
  }

  async close() {
    await this.page.context().close();
  }
}