import { test, Page, expect } from '@playwright/test';
import { ppkNumber } from '../data/ppkNumber';
import path from 'path';

// ✅ Global timeout test 2 menit (120000 ms)
test.setTimeout(120000);

export class WoJual {
  constructor(private readonly page: Page) {}

  // 🔹 Helper upload foto kendaraan (tetap di popup yg sama)
  private async uploadFoto(
    popup: Page,
    filePath: string,
    value: string,
    label: string
  ) {
    // pilih file
    await popup.locator('input[type="file"][name="theFile"]').setInputFiles(filePath);

    // pilih kategori
    const categorySelect = popup.locator('#idCategory');
    await expect(categorySelect).toBeVisible({ timeout: 60000 });
    await categorySelect.selectOption(value, { timeout: 60000 });

    // klik Add → tunggu row baru muncul di tabel hasil upload
    const addButton = popup.locator('input[type="submit"][value="Add"]');
    await Promise.all([
      popup.locator('table tr').filter({ hasText: label }).first().waitFor({ state: 'visible', timeout: 60000 }),
      addButton.click(),
    ]);

    console.log(`✅ Foto kategori ${label} berhasil diupload`);
  }

  async navigateToWoJual() {
    const page = this.page;

    // ---- Menu navigation ----
    await page.getByText('Finance AR').click({ timeout: 60000 });
    await page.getByText('Entry').click({ timeout: 60000 });
    await page.getByText('Write Off').first().click({ timeout: 60000 });

    // Cari termination sesuai ppkNumber
    const optionValue = await page
      .locator('select[name="terminationId"] option')
      .filter({ hasText: ppkNumber })
      .getAttribute('value');

    await page
      .locator('select[name="terminationId"]')
      .selectOption(optionValue!, { timeout: 60000 });

    // Pilih "Jual"
    await page
      .locator('select[name="revokeSubCategoryId"]')
      .selectOption({ label: 'Jual' }, { timeout: 60000 });

    // Klik Submit dan tunggu redirect
    await Promise.all([
      page.waitForNavigation({
        url: /assetForFutureSalesSkalaRentalForm\.do/,
        timeout: 60000,
      }),
      page.getByRole('button', { name: 'Submit' }).click({ timeout: 60000 }),
    ]);

    await expect(page).toHaveURL(/assetForFutureSalesSkalaRentalForm\.do/);
    console.log('✅ Redirected page URL:', page.url());

    // ---- Isi form ----
    await page.locator('input[name="paymentAmount"]').fill('20000000');
    await page
      .locator('select[name="bankAccountId"]')
      .selectOption('57', { timeout: 90000 });

    // ---- Buka popup Upload Foto Kendaraan ----
    const popupPromise = page.context().waitForEvent('page');
    await page.getByRole('button', { name: 'Upload Foto Kendaraan' }).click();
    const popup = await popupPromise;

    await popup.waitForLoadState('domcontentloaded', { timeout: 60000 });
    await expect(popup).toHaveURL(/utnWoFilesList\.do/);

    // Path file foto (ubah sesuai OS & path)
    const filePath = path.resolve(
      '/Users/faishalperdananto/Documents/Magang/Test A.jpeg'
    );

    // 🔹 Upload beberapa foto dengan kategori berbeda
    const fotoList = [
      { file: filePath, value: '10006', label: 'TAMPAK DEPAN' },
      { file: filePath, value: '10007', label: 'TAMPAK BELAKANG' },
      { file: filePath, value: '10008', label: 'TAMPAK SAMPING KANAN' },
      { file: filePath, value: '10009', label: 'TAMPAK SAMPING KIRI' },
      { file: filePath, value: '10010', label: 'INTERIOR (ARAH DASHBOARD)' },
      { file: filePath, value: '10011', label: 'INTERIOR (ARAH KACA BELAKANG)' },
      { file: filePath, value: '12020', label: 'FOTO KILOMETER' },
      { file: filePath, value: '10011', label: 'FOTO MESIN' },
    ];

    for (const foto of fotoList) {
      await this.uploadFoto(popup, foto.file, foto.value, foto.label);
    }

    console.log('✅ Semua foto berhasil diupload');

    // ---- Optional flow approval ----
    if (page.url().includes('/assetManagementUtn/approvalBidderPage.do')) {
      const approveButton = page.locator(
        'input.Button[type="button"][onclick*="APPROVE"]'
      );
      await expect(approveButton).toBeVisible({ timeout: 60000 });

      const dialogPromise = page.waitForEvent('dialog');
      await Promise.all([
        dialogPromise.then(async (dialog) => {
          await dialog.accept();
        }),
        approveButton.click({ noWaitAfter: true }),
      ]);
    }
  }

  async logout() {
    const page = this.page;
    await Promise.all([
      page.waitForNavigation({ timeout: 60000 }),
      page.locator('a:has(img[src*="logoff1.png"])').click(),
    ]);
  }
}
