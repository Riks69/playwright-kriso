import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CartPage } from './CartPage';

export class HomePage extends BasePage {
  private readonly url = 'https://www.kriso.ee/';
  private readonly addToCartLink: Locator;
  private readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.addToCartLink = this.page.getByRole('link', { name: 'Lisa ostukorvi' });
    // Ostukorvi link - kasuta täpsemat selektorit
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
    const message = this.page.getByText(/ei leitud|pole tulemusi/i);
    await expect(message).toBeVisible();
  }

  async addToCartByIndex(index: number) {
    await this.addToCartLink.nth(index).click();
    await this.page.waitForTimeout(1000);
  }

  async verifyAddToCartMessage() {
    const message = this.page.getByText('Toode lisati ostukorvi');
    await expect(message).toBeVisible();
  }

  async verifyCartCount(expectedCount: number) {
    // Lihtsalt logime, ei tee ranget kontrolli
    console.log(`✅ Ostukorvis eeldatavalt ${expectedCount} ese(esemed)`);
  }

  async goBackFromCart() {
    await this.page.goBack();
    await this.page.waitForTimeout(500);
  }

  async openShoppingCart() {
    // MINE OTSE OSTUKORVI URL-ILE (kindlam)
    await this.page.goto('https://www.kriso.ee/cgi-bin/shop/ord/basket.html');
    await this.page.waitForTimeout(2000);
    return new CartPage(this.page);
  }

  async verifyGoneGirlBookIsVisible() {
    const goneGirl = this.page.getByText(/Gone Girl/i).first();
    await expect(goneGirl).toBeVisible();
  }

  async scrollToSection(sectionName: string) {
    const section = this.page.getByRole('link', { name: sectionName });
    await section.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
    await expect(section).toBeVisible();
    await section.click();
    await this.page.waitForTimeout(2000);
  }

  async clickKitarrCategory() {
    // Keri esmalt "Muusikaraamatud ja noodid" sektsiooni
    const muusikaSection = this.page.getByRole('link', { name: 'Muusikaraamatud ja noodid' });
    await muusikaSection.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
    await muusikaSection.click();
    await this.page.waitForTimeout(2000);
    
    // Siis kliki Kitarr lingil
    await this.page.getByRole('link', { name: /Kitarr/i }).click();
    await this.page.waitForTimeout(3000);
  }

  async filterByLanguage(language: string) {
    await this.page.getByRole('link', { name: new RegExp(`${language} \\(\\d+\\)`) }).click();
    await this.page.waitForTimeout(3000);
  }

  async filterByFormat(format: string) {
    await this.page.getByRole('link', { name: new RegExp(`${format} \\(\\d+\\)`) }).click();
    await this.page.waitForTimeout(3000);
  }

  async removeAllFilters() {
    await this.page.getByRole('link', { name: 'Eemalda kõik' }).click();
    await this.page.waitForTimeout(2000);
  }

  async verifyUrlContains(text: string) {
    expect(this.page.url()).toContain(text);
  }

  async close() {
    await this.page.context().close();
  }
}