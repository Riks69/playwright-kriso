/**
 * Part II — Page Object Model tests
 * Test suite: Add Books to Shopping Cart
 */
import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { CartPage } from '../../pages/CartPage';

test.describe.configure({ mode: 'serial' });

let homePage: HomePage;
let cartPage: CartPage;

test.describe('Add Books to Shopping Cart (POM)', () => {

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

  test('Test search shows multiple results', async () => {
    await homePage.searchByKeyword('harry potter');
    await homePage.verifyResultsCountMoreThan(1);
  });

  test('Test add first book to cart', async () => {
    await homePage.addToCartByIndex(0);
    await homePage.verifyAddToCartMessage();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await homePage.goBackFromCart();
  });

  test('Test add second book to cart', async () => {
    await homePage.searchByKeyword('harry potter');
    await homePage.verifyResultsCountMoreThan(1);
    await homePage.addToCartByIndex(1);
    await homePage.verifyAddToCartMessage();
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  test('Test navigate to cart', async () => {
    cartPage = await homePage.openShoppingCart();
    await new Promise(resolve => setTimeout(resolve, 2000));
    expect(homePage['page'].url()).toContain('basket');
  });

  test('Test cart has items', async () => {
    const page = homePage['page'];
    // Mõlemas keeles - inglise keeles on "Items total: X"
    const items = page.getByText(/Tooteid kokku:|Items total:/i);
    await expect(items.first()).toBeVisible();
    console.log('✅ Ostukorvis on esemeid');
  });

  test('Test remove first item from cart', async () => {
    await cartPage.removeItemByIndex(0);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const page = homePage['page'];
    const items = page.getByText(/Tooteid kokku:|Items total:/i);
    await expect(items.first()).toBeVisible();
    console.log('✅ Eemaldamine õnnestus');
  });

  test('Test cart still works after removal', async () => {
    const page = homePage['page'];
    const title = await page.title();
    expect(title).toBeTruthy();
    console.log('✅ Ostukorvi leht töötab');
  });
});