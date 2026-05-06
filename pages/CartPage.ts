import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly removeButton: Locator;

  constructor(page: Page) {
    super(page);
    // Eemaldamise nupp - prügikasti ikoon
    this.removeButton = this.page.getByRole('link').filter({ hasText: /^$/ });
  }

  async verifyCartCount(expectedCount: number) {
    // Kontrolli, et ostukorvis on õige arv esemeid
    const itemsText = this.page.getByText(`Tooteid kokku: ${expectedCount}`);
    await expect(itemsText).toBeVisible({ timeout: 10000 });
  }

  async removeItemByIndex(index: number) {
    await this.removeButton.nth(index).click();
    await this.page.waitForTimeout(1000);
  }

  async getCartItemCount(): Promise<number> {
    // Tagastab ostukorvis olevate esemete arvu
    const itemsText = this.page.getByText(/Tooteid kokku: \d+/);
    const text = await itemsText.textContent();
    const match = text?.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }
}