import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected readonly searchInput: Locator;
  protected readonly searchButton: Locator;

  constructor(protected page: Page) {
    // PARANDATUD: ainult getBy... meetodid
    this.searchInput = this.page.getByRole('textbox', { name: 'Pealkiri, autor, ISBN, märksõ' });
    this.searchButton = this.page.getByRole('button', { name: 'Search' });
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
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
    await this.page.waitForTimeout(2000);
  }
}