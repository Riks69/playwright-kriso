/**
 * Part I — Flat tests (no POM)
 * Test suite: Navigate Products via Filters
 *
 * Rules:
 *   - Use only: getByRole, getByText, getByPlaceholder, getByLabel
 *   - No CSS class selectors, no XPath
 */
import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page: any;

test.describe('Navigate Products via Filters', () => {

  // ============================================================
  // TEST 1: Avalehe kontroll
  // ============================================================
  test('TEST 1: Open Kriso.ee and verify page has Kriso title/logo', async ({ browser }) => {
    console.log('📌 TEST 1: Avalehe kontroll');
    
    const context = await browser.newContext();
    page = await context.newPage();
    
    await page.goto('https://www.kriso.ee/');
    await page.getByRole('button', { name: 'Nõustun' }).click();
    console.log('✅ Leht avatud ja küpsistega nõustutud');
    
    const title = await page.title();
    expect(title.toLowerCase()).toContain('kriso');
    console.log(`✅ Lehe pealkiri: "${title}" - sisaldab sõna "kriso"`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  // ============================================================
  // TEST 2: Kliki "Muusikaraamatud ja noodid" sektsioonil
  // ============================================================
  test('TEST 2: Click "Muusikaraamatud ja noodid" section', async () => {
    console.log('📌 TEST 2: Sektsiooni "Muusikaraamatud ja noodid" valimine');
    
    const muusikaSection = page.getByRole('link', { name: 'Muusikaraamatud ja noodid' });
    await muusikaSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    await muusikaSection.click();
    await page.waitForTimeout(2000);
    console.log('✅ Klõpsatud sektsioonil "Muusikaraamatud ja noodid"');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  // ============================================================
  // TEST 3: Kliki "Kitarr" kategoorial
  // ============================================================
  test('TEST 3: Click "Kitarr" category and verify products', async () => {
    console.log('📌 TEST 3: Kategooria "Kitarr" valimine');
    
    await page.getByRole('link', { name: /Kitarr \(\d+\)/ }).click();
    await page.waitForTimeout(3000);
    console.log('✅ Klõpsatud kategoorial "Kitarr"');
    
    const resultsText = page.getByText(/Otsingu vasteid leitud: \d+/);
    await expect(resultsText).toBeVisible();
    console.log('✅ Tulemuste tekst on nähtav');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  // ============================================================
  // TEST 4: Kontrolli URL-i
  // ============================================================
  test('TEST 4: Verify URL contains kitarr information', async () => {
    console.log('📌 TEST 4: URL-i kontroll');
    
    const currentUrl = page.url();
    console.log(`📍 Praegune URL: ${currentUrl}`);
    
    expect(currentUrl).toContain('instrument=Guitar');
    expect(currentUrl).toContain('database=musicsales');
    console.log('✅ URL sisaldab instrument=Guitar ja database=musicsales');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  // ============================================================
  // TEST 5: Filtreeri keele järgi (Inglise)
  // ============================================================
  test('TEST 5: Filter by language (English)', async () => {
    console.log('📌 TEST 5: Keelefiltri rakendamine - "Inglise"');
    
    await page.getByRole('link', { name: /Inglise \(\d+\)/ }).click();
    await page.waitForTimeout(3000);
    console.log('✅ Klõpsatud filtril "Inglise"');
    
    const resultsText = page.getByText(/Otsingu vasteid leitud: \d+/);
    await expect(resultsText).toBeVisible();
    console.log('✅ Tulemused värskendatud');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  // ============================================================
  // TEST 6: Filtreeri formaadi järgi (CD)
  // ============================================================
  test('TEST 6: Filter by format "CD"', async () => {
    console.log('📌 TEST 6: Formaadi filtri rakendamine - "CD"');
    
    await page.getByRole('link', { name: /CD \(\d+\)/ }).click();
    await page.waitForTimeout(3000);
    console.log('✅ Klõpsatud filtril "CD"');
    
    const resultsText = page.getByText(/Otsingu vasteid leitud: \d+/);
    await expect(resultsText).toBeVisible();
    console.log('✅ Tulemused värskendatud');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  // ============================================================
  // TEST 7: Eemalda kõik filtrid (lihtsalt kliki, ära kontrolli tulemusi)
  // ============================================================
  test('TEST 7: Remove all filters', async () => {
    console.log('📌 TEST 7: Kõigi filtrite eemaldamine');
    
    await page.getByRole('link', { name: 'Eemalda kõik' }).click();
    await page.waitForTimeout(3000);
    console.log('✅ Klõpsatud "Eemalda kõik"');
    console.log('✅ Filtrid eemaldatud');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  // ============================================================
  // TEST 8: Lõplik kontroll (lihtsalt veendu, et leht on töökorras)
  // ============================================================
  test('TEST 8: Verify page is still working', async () => {
    console.log('📌 TEST 8: Lõplik kontroll');
    
    const title = await page.title();
    expect(title).toBeTruthy();
    console.log('✅ Leht on endiselt avatud');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉🎉🎉 KÕIK FILTRITE TESTID LÄBITUD! 🎉🎉🎉');
  });

  test.afterAll(async () => {
    await page?.context()?.close();
  });
});