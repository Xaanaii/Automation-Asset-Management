import { Page, expect } from '@playwright/test';
import { ppkNumberCancelRevoke } from '../data/ppkNumber';

export class CancelRevoke {
  constructor(private readonly page: Page) {}

  async navigateToCancelRevoke() {
    const page = this.page;

    // ---- Menu navigation ----
    await page.getByText('Finance AR').click({ timeout: 60000 });
    await page.getByText('Entry').click({ timeout: 60000 });
    await page.getByText('Termination').first().click({ timeout: 60000 });

    // ---- Cari PPK ----
    await page.locator('input[name="number"]').fill(ppkNumberCancelRevoke);
    await page.getByRole('button', { name: 'Search' }).click();

    // Validasi hasil tabel ada nomor PPK
    await expect(page.locator(`text=${ppkNumberCancelRevoke}`)).toBeVisible({
      timeout: 60000,
    });

    // ---- Klik detail ----
    await page.locator('img[title="Detail"]').click({ timeout: 30000 });

    // ---- Klik Cancel Revoke Status + handle dialog ----
    const cancelBtn = page.getByRole('button', { name: 'Cancel Revoke Status' });
    await expect(cancelBtn).toBeVisible({ timeout: 30000 });

    // pasang listener sekali untuk dialog, langsung accept
    page.once('dialog', async (dialog) => {
      console.log('⚠️ Dialog muncul:', dialog.message());
      await dialog.accept();
    });

    await cancelBtn.click({ timeout: 30000 });

    // Validasi sudah balik / tetap di halaman detail setelah cancel revoke
    await expect(page).toHaveURL(/termination\/detail\.do/, { timeout: 60000 });
    console.log('✅ Cancel Revoke berhasil dijalankan');
  }

  async logout() {
    const page = this.page;
    await Promise.all([
      page.waitForNavigation(),
      page.locator('a:has(img[src*="logoff1.png"])').click(),
    ]);
  }
}
