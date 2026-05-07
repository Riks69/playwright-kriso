import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected readonly searchInput: Locator;
  protected readonly searchButton: Locator;

  constructor(protected page: Page) {
    // PARANDATUD: otsinguväli mõlemas keeles
    this.searchInput = this.page.getByRole('textbox', { name: /Pealkiri, autor, ISBN, märksõ|Title, author, ISBN, keyword/i });
    // PARANDATUD: otsingunupp mõlemas keeles
    this.searchButton = this.page.getByRole('button', { name: /Search|Otsi/i });
  }

  async acceptCookies() {
    const consentButton = this.page.getByRole('button', { name: /Nõustun|Accept|OK/i });
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

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}