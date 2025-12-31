import { Page, expect } from '@playwright/test';
import { phoneNumberBOH } from '../data/phoneNumber';

export class ResetImei {
  constructor(private readonly page: Page) {}

  async navigateToResetImei() {
    const page = this.page;

    // Masuk menu register SMMF ONE
    await page.getByText('SMMF ONE').click({ timeout: 5000 });
    await page.getByText('Entry').click({ timeout: 5000 });
    await page.getByText('SMMF ONE Register').first().click({ timeout: 5000 });

    // Isi nomor handphone
    const phone = phoneNumberBOH || '084416000238'; // fallback jika undefined
    await page.locator('input[name="handphone"]').fill(phone);

    // Klik tombol Search
    await page.locator('input[type="submit"][value="Search"]').click();

    // Validasi hasil
    await expect(page.locator(`text=${phone}`)).toBeVisible({ timeout: 60000 });

    /// Klik tombol Edit (ambil yang pertama saja)
    await page.waitForSelector('a[onclick*="edit"] img[title="Edit"]', { timeout: 10000 });
    await page.locator('a[onclick*="edit"] img[title="Edit"]').first().click();

    // Jeda 5 detik sebelum klik Clear
    await page.waitForTimeout(5000);

    // Klik tombol Clear
    await page.locator('input[type="button"][value*="Clear"]').click();

    // Klik tombol Submit
    await page.locator('#btnSubmit').click();
    await page.waitForLoadState('networkidle');

  }

  async logout() {
    const page = this.page;
    await Promise.all([
      page.waitForNavigation(),
      page.locator('a:has(img[src*="logoff1.png"])').click()
    ]);
  }
}
