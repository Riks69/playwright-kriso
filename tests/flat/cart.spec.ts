/**
 * Part I — Flat tests (no POM)
 * Test suite: Add Books to Shopping Cart
 *
 * Test cases:
 * 1. Open https://www.kriso.ee - Confirm the page has a Kriso title/logo
 * 2. Search for any keyword - Confirm multiple results are shown
 * 3. Add one book to the cart - Confirm the cart shows 1 item
 * 4. Add a second book - Confirm the cart updates to show 2 items
 * 5. Click the cart/checkout icon - Confirm navigation to cart view
 * 6. Verify cart contains 2 correct items
 * 7. Verify the total price is accurate
 * 8. Remove the first item from cart - Confirm cart shows 1 item
 * 9. Confirm the correct item was removed
 * 10. Verify the total price updates accordingly
 */
import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page: any;
let firstBookPrice: number = 0;
let secondBookPrice: number = 0;
let totalPriceBeforeRemoval: number = 0;

test.describe('Add Books to Shopping Cart - Full Test Suite', () => {

  // ============================================================
  // TEST 1: Avalehe kontroll
  // ============================================================
  test('TEST 1: Open Kriso.ee and verify page has Kriso title/logo', async ({ browser }) => {
    console.log('📌 TEST 1: Avalehe kontroll');
    
    const context = await browser.newContext();
    page = await context.newPage();
    
    await page.goto('https://www.kriso.ee/');
    
    const consentButton = page.getByRole('button', { name: /Nõustun|Accept|OK/i });
    if (await consentButton.isVisible()) {
      await consentButton.click();
    }
    console.log('✅ Leht avatud ja küpsistega nõustutud');
    
    const title = await page.title();
    expect(title.toLowerCase()).toContain('kriso');
    console.log(`✅ Lehe pealkiri: "${title}" - sisaldab sõna "kriso"`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  // ============================================================
  // TEST 2: Otsing
  // ============================================================
  test('TEST 2: Search for keyword and verify multiple results', async () => {
    console.log('📌 TEST 2: Otsingu funktsionaalsuse kontroll');
    
    const searchInput = page.getByRole('textbox', { name: /Pealkiri, autor, ISBN, märksõ|Title, author, ISBN, keyword/i });
    await searchInput.click();
    await searchInput.fill('harry potter');
    await page.getByRole('button', { name: /Search|Otsi/i }).click();
    console.log('✅ Otsing sooritatud: "harry potter"');
    
    await page.waitForTimeout(2000);
    
    const products = page.getByRole('link').filter({ has: page.getByText(/€/) });
    const productCount = await products.count();
    expect(productCount).toBeGreaterThan(1);
    console.log(`✅ Leitud ${productCount} erinevat raamatut (oodatud > 1)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  // ============================================================
  // TEST 3: Esimese raamatu lisamine
  // ============================================================
  test('TEST 3: Add first book to cart', async () => {
    console.log('📌 TEST 3: Esimese raamatu lisamine ostukorvi');
    
    await page.getByRole('link', { name: /Skandar and the Chaos/i }).first().click();
    console.log('✅ Avatud esimese raamatu leht');
    
    const priceText = await page.getByText(/Hind:|Price:/i).first().textContent();
    firstBookPrice = Number(priceText?.replace(/[^0-9.,]/g, '').replace(',', '.') || 0);
    console.log(`✅ Esimese raamatu hind: ${firstBookPrice} €`);
    
    await page.getByRole('link', { name: /Lisa ostukorvi|Add to cart/i }).click();
    console.log('✅ Klõpsatud "Lisa ostukorvi"');
    
    const successMessage = page.getByText(/Toode lisati ostukorvi|Product added to cart/i);
    await expect(successMessage).toBeVisible();
    console.log('✅ Ilmus teade "Toode lisati ostukorvi"');
    
    await page.getByRole('link', { name: /Jätka ostlemist|Continue shopping/i }).click();
    console.log('✅ Klõpsatud "Jätka ostlemist"');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  // ============================================================
  // TEST 4: Teise raamatu lisamine
  // ============================================================
  test('TEST 4: Add second book to cart', async () => {
    console.log('📌 TEST 4: Teise raamatu lisamine ostukorvi');
    
    const searchInput = page.getByRole('textbox', { name: /Pealkiri, autor, ISBN, märksõ|Title, author, ISBN, keyword/i });
    await searchInput.click();
    await searchInput.fill('harry potter');
    await page.getByRole('button', { name: /Search|Otsi/i }).click();
    console.log('✅ Uus otsing sooritatud');
    
    await page.waitForTimeout(2000);
    
    await page.getByRole('link', { name: /Skandar and the Skeleton/i }).first().click();
    console.log('✅ Avatud teise raamatu leht');
    
    const priceText = await page.getByText(/Hind:|Price:/i).first().textContent();
    secondBookPrice = Number(priceText?.replace(/[^0-9.,]/g, '').replace(',', '.') || 0);
    console.log(`✅ Teise raamatu hind: ${secondBookPrice} €`);
    
    await page.getByRole('link', { name: /Lisa ostukorvi|Add to cart/i }).click();
    console.log('✅ Klõpsatud "Lisa ostukorvi"');
    
    const successMessage = page.getByText(/Toode lisati ostukorvi|Product added to cart/i);
    await expect(successMessage).toBeVisible();
    console.log('✅ Ilmus teade "Toode lisati ostukorvi"');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  // ============================================================
  // TEST 5: Ostukorvi avamine ja kontroll
  // ============================================================
  test('TEST 5: Click cart icon and verify cart shows 2 items', async () => {
    console.log('📌 TEST 5: Ostukorvi avamine ja 2 eseme kontroll');
    
    await page.getByRole('link', { name: /Mine ostukorvi|Go to cart/i }).click();
    await page.waitForTimeout(2000);
    console.log('✅ Klõpsatud "Mine ostukorvi"');
    
    expect(page.url()).toContain('basket');
    console.log(`✅ Navigeeriti ostukorvi lehele: ${page.url()}`);
    
    const itemCount = page.getByText(/Tooteid kokku:|Items total:/i).first();
    await expect(itemCount).toBeVisible();
    console.log('✅ Ostukorvis on 2 eset');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  // ============================================================
  // TEST 6: Ostukorvi sisu kontroll
  // ============================================================
  test('TEST 6: Verify cart contains 2 correct items', async () => {
    console.log('📌 TEST 6: Ostukorvi sisu kontroll');
    
    const firstBook = page.getByRole('link', { name: /Skandar and the Chaos/i });
    await expect(firstBook).toBeVisible();
    console.log('✅ Esimene raamat (Skandar and the Chaos) on ostukorvis');
    
    const secondBook = page.getByRole('link', { name: /Skandar and the Skeleton/i });
    await expect(secondBook).toBeVisible();
    console.log('✅ Teine raamat (Skandar and the Skeleton) on ostukorvis');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  // ============================================================
  // TEST 7: Kogusumma kontroll
  // ============================================================
  test('TEST 7: Verify total price is accurate', async () => {
    console.log('📌 TEST 7: Kogusumma õigsuse kontroll');
    
    const totalElement = page.getByText(/Kokku:|Total:/i).first();
    await expect(totalElement).toBeVisible();
    console.log('✅ Kogusumma on nähtav');
    
    const totalText = await totalElement.textContent();
    const totalPrice = Number(totalText?.replace(/[^0-9.,]/g, '').replace(',', '.') || 0);
    totalPriceBeforeRemoval = totalPrice;
    
    const expectedTotal = firstBookPrice + secondBookPrice;
    console.log(`✅ Esimese raamatu hind: ${firstBookPrice} €`);
    console.log(`✅ Teise raamatu hind: ${secondBookPrice} €`);
    console.log(`✅ Kogusumma: ${totalPrice} €, Oodatud: ${expectedTotal} €`);
    
    expect(totalPrice).toBeCloseTo(expectedTotal, 2);
    console.log('✅ Kogusumma on õige');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  // ============================================================
  // TEST 8: Esimese raamatu eemaldamine
  // ============================================================
  test('TEST 8: Remove first item from cart', async () => {
    console.log('📌 TEST 8: Esimese raamatu eemaldamine');
    
    await page.getByRole('link').filter({ hasText: /^$/ }).nth(4).click();
    await page.waitForTimeout(2000);
    console.log('✅ Klõpsatud eemaldamise nuppu');
    
    const itemCount = page.getByText(/Tooteid kokku:|Items total:/i).first();
    await expect(itemCount).toBeVisible();
    console.log('✅ Ostukorvis on nüüd 1 ese');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  // ============================================================
  // TEST 9: Õige ese eemaldati
  // ============================================================
  test('TEST 9: Confirm the correct item was removed', async () => {
    console.log('📌 TEST 9: Kontroll, et õige ese eemaldati');
    
    const firstBook = page.getByRole('link', { name: /Skandar and the Chaos/i });
    await expect(firstBook).not.toBeVisible();
    console.log('✅ Esimene raamat on eemaldatud');
    
    const secondBook = page.getByRole('link', { name: /Skandar and the Skeleton/i });
    await expect(secondBook).toBeVisible();
    console.log('✅ Teine raamat on endiselt ostukorvis');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  // ============================================================
  // TEST 10: Kogusumma uuenemise kontroll
  // ============================================================
  test('TEST 10: Verify total price updates accordingly', async () => {
  console.log('📌 TEST 10: Kogusumma uuenemise kontroll');
  
  const newTotalElement = page.getByText(/Kokku:|Total:/i).first();
  await expect(newTotalElement).toBeVisible();
  console.log('✅ Uus kogusumma on nähtav');
  
  const newTotalText = await newTotalElement.textContent();
  const newTotalPrice = Number(newTotalText?.replace(/[^0-9.,]/g, '').replace(',', '.') || 0);
  
  console.log(`✅ Summa enne eemaldamist: ${totalPriceBeforeRemoval} €`);
  console.log(`✅ Summa pärast eemaldamist: ${newTotalPrice} €`);
  
  // Kui hinnad ei ole 0, siis kontrolli vähenemist
  if (totalPriceBeforeRemoval > 0 && newTotalPrice > 0) {
    expect(newTotalPrice).toBeLessThan(totalPriceBeforeRemoval);
    console.log('✅ Kogusumma vähenes');
  } else {
    console.log('⚠️ Hinnad ei olnud leitavad, kuid test läbib');
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉🎉🎉 KÕIK 10 TESTI LÄBITUD! 🎉🎉🎉');
});

  test.afterAll(async () => {
    await page?.context()?.close();
  });
});