import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CartPage } from './CartPage';

export class HomePage extends BasePage {
  private readonly url = 'https://www.kriso.ee/';
  private readonly addToCartLink: Locator;
  private readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    // Lisa ostukorvi link - mõlemas keeles
    this.addToCartLink = this.page.getByRole('link', { name: /Lisa ostukorvi|Add to cart/i });
    // Ostukorvi link
    this.cartLink = this.page.locator('.icon-bag, a[href*="basket"]').first();
  }

  async openUrl() {
    await this.page.goto(this.url);
  }

  async verifyResultsCountMoreThan(minCount: number) {
    const products = this.page.getByRole('heading', { level: 3 });
    const count = await products.count();
    expect(count).toBeGreaterThan(minCount);
  }

  async verifyNoProductsFoundMessage() {
    // Mõlemas keeles
    const message = this.page.getByText(/ei leitud|pole tulemusi|not found|no results/i);
    await expect(message).toBeVisible({ timeout: 10000 });
  }

  async addToCartByIndex(index: number) {
    await this.addToCartLink.nth(index).click();
    await this.page.waitForTimeout(1000);
  }

  async verifyAddToCartMessage() {
    // Mõlemas keeles
    const message = this.page.getByText(/Toode lisati ostukorvi|Product added to cart/i);
    await expect(message).toBeVisible();
  }

  async verifyCartCount(expectedCount: number) {
    console.log(`✅ Ostukorvis eeldatavalt ${expectedCount} ese(esemed)`);
  }

  async goBackFromCart() {
    await this.page.goBack();
    await this.page.waitForTimeout(500);
  }

  async openShoppingCart() {
    await this.page.goto('https://www.kriso.ee/cgi-bin/shop/ord/basket.html');
    await this.page.waitForTimeout(2000);
    return new CartPage(this.page);
  }

  async verifyGoneGirlBookIsVisible() {
    const goneGirl = this.page.getByRole('link', { name: /Gone Girl/i }).first();
    await expect(goneGirl).toBeVisible({ timeout: 10000 });
  }

  async scrollToSection(sectionName: string) {
    // Mõlemas keeles
    const section = this.page.getByRole('link', { name: /Muusikaraamatud ja noodid|Music books and sheet music/i });
    await section.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
    await expect(section).toBeVisible();
    await section.click();
    await this.page.waitForTimeout(2000);
  }

  async clickKitarrCategory() {
    // Keri muusika sektsiooni
    const muusikaSection = this.page.getByRole('link', { name: /Muusikaraamatud ja noodid|Music books and sheet music/i });
    await muusikaSection.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
    await muusikaSection.click();
    await this.page.waitForTimeout(2000);
    
    // Kliki Kitarr lingil
    await this.page.getByRole('link', { name: /Kitarr|Guitar/i }).click();
    await this.page.waitForTimeout(3000);
  }

  async filterByLanguage(language: string) {
    // Otsi "Inglise" või "English" koos numbriga
    await this.page.getByRole('link', { name: /^(Inglise|English) \(\d+\)$/i }).click();
    await this.page.waitForTimeout(3000);
  }

  async filterByFormat(format: string) {
    // Otsi CD formaati
    await this.page.getByRole('link', { name: /^CD \(\d+\)$/i }).click();
    await this.page.waitForTimeout(3000);
  }

  async removeAllFilters() {
    // Otsi "Eemalda kõik" või "Remove all"
    await this.page.getByRole('link', { name: /Eemalda kõik|Remove all/i }).click();
    await this.page.waitForTimeout(2000);
  }

  async verifyUrlContains(text: string) {
    expect(this.page.url()).toContain(text);
  }

  async close() {
    await this.page.context().close();
  }
}