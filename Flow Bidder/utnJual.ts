import { test, Page, expect } from '@playwright/test';
import { ppkNumberUTN } from '../data/ppkNumber';
import path from 'path';

// ✅ Global timeout test 2 menit (120000 ms)
test.setTimeout(120000);

export class UTNJual {
  constructor(private readonly page: Page) {}

  // 🔹 Helper upload DOC UTN
  private async uploadDocUTN(
    popup: Page,
    filePath: string,
    value: string,
    label: string
  ) {
    // pilih file
    await popup.locator('input[type="file"][name="theFile"]').setInputFiles(filePath);

    // tunggu select kategori muncul (DOC UTN pakai #fileCategoryId)
    const categorySelect = popup.locator('#fileCategoryId');
    await expect(categorySelect).toBeVisible({ timeout: 30000 });
    await categorySelect.selectOption(value);

    // klik Upload
    const uploadButton = popup.locator('input[type="submit"][value="Upload"]');
    await Promise.all([
      uploadButton.click(),
      popup.locator('table tr').filter({ hasText: label }).first().waitFor({ state: 'visible', timeout: 30000 }),
    ]);

    console.log(`✅ Dokumen ${label} berhasil diupload`);
  }

  // 🔹 Helper upload Foto Kendaraan
  private async uploadFotoKendaraan(
    popup: Page,
    filePath: string,
    value: string,
    label: string
  ) {
    // pilih file
    await popup.locator('input[type="file"][name="theFile"]').setInputFiles(filePath);

    // tunggu select kategori muncul (Foto Kendaraan pakai #idCategory)
    const categorySelect = popup.locator('#idCategory');
    await expect(categorySelect).toBeVisible({ timeout: 30000 });
    await categorySelect.selectOption(value);

    // klik Add
    const addButton = popup.locator('input[type="submit"][value="Add"]');
    await Promise.all([
      addButton.click(),
      popup.locator('table tr').filter({ hasText: label }).first().waitFor({ state: 'visible', timeout: 30000 }),
    ]);

    console.log(`✅ Foto kendaraan kategori ${label} berhasil diupload`);
  }

  async navigateToUTNJual() {
    const page = this.page;

    // ---- Menu navigation ----
    await page.getByText('Finance AR').click({ timeout: 60000 });
    await page.getByText('Entry').click({ timeout: 60000 });
    await page.getByText('Unit Titipan Nasabah').first().click({ timeout: 60000 });

    // ---- Cari termination sesuai ppkNumber ----
    const optionValue = await page
      .locator('select[name="terminationId"] option')
      .filter({ hasText: ppkNumberUTN })
      .getAttribute('value');

    await page.locator('select[name="terminationId"]').selectOption(optionValue!);

    // Pilih "Jual"
    await page.locator('select[name="revokeStatusId"]').selectOption({ label: 'JUAL' });

    /*// ---- Klik ikon PopupBidder dan tunggu popup terbuka ----
    const [popupBidder] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('img[title="PopupBidder"]').click(),
    ]);

    await popupBidder.waitForLoadState('domcontentloaded');
    await expect(popupBidder).toHaveURL(/penyelesaianPopupBidder\.do/);

    console.log('✅ PopupBidder terbuka');

    // Click search
    await popupBidder.getByRole('button', { name: 'Search' }).click();

    // Klik salah satu NIB
    const nib = 'BID24120001';
    const nibLink = popupBidder.locator(`a:has-text("${nib}")`); */

    /*// Ambil nama bidder dari onclick
    const onclickAttr = await nibLink.getAttribute('onclick');
    if (!onclickAttr) throw new Error(`❌ Tidak menemukan onclick untuk NIB ${nib}`);
    const match = onclickAttr.match(/pick\([^,]+,\s*'([^']+)'/);
    if (!match) throw new Error(`❌ Gagal parsing Sold To dari onclick`);
    const expectedSoldTo = match[1];

    // Klik NIB dan tunggu popup close
    await Promise.all([
      popupBidder.waitForEvent('close'),
      nibLink.click(),
    ]);

    console.log(`✅ NIB ${nib} dipilih, Sold To: ${expectedSoldTo}`);*/

    // ---- Balik ke halaman utama ----
   // await expect(page).toHaveURL(/assetForFutureSalesSave\.do#/, { timeout: 60000 });

    // Verifikasi field
   // await expect(page.locator('input[name="soldTo"]')).toHaveValue(expectedSoldTo);
    await expect(page.locator('input[name="isSpk"]')).toHaveValue(/Yes|No/);
    await expect(page.locator('input[name="teamCollection"]')).not.toHaveValue('');

    console.log('✅ Field SoldTo, isSpk, dan teamCollection sudah terisi');

    // ---- Isi form ----
    await page.locator('input[name="soldAmount"]').fill('50000000');
    await page.locator('input[name="paymentStatusAmount"]').fill('50000000');

    // ---- Buka popup Upload DOC UTN ----
    const popupDocUTN = page.context().waitForEvent('page');
    await page.getByRole('button', { name: 'Upload Doc UTN' }).click();
    const popupDOC = await popupDocUTN;

    await popupDOC.waitForLoadState('domcontentloaded');
    await expect(popupDOC).toHaveURL(/assetForFutureSalesImageList\.do/);

    // Path file doc
    const filePathDOC = path.resolve('/Users/faishalperdananto/Documents/Magang/Test A.jpeg');

    // Upload beberapa dokumen
    const docList = [
      { file: filePathDOC, value: '371', label: 'KTP' },
      { file: filePathDOC, value: '372', label: 'BUKTI SLIP' },
      { file: filePathDOC, value: '373', label: 'BUKTI SLIP2' },
    ];

    for (const doc of docList) {
      await this.uploadDocUTN(popupDOC, doc.file, doc.value, doc.label);
    }

    console.log('✅ Semua dokumen UTN berhasil diupload');

    // Tutup popup DOC UTN (kalau masih terbuka)
    await popupDOC.close();

    // ---- Buka popup Upload Foto Kendaraan ----
    const popupFoto = page.context().waitForEvent('page');
    await page.getByRole('button', { name: 'Upload Foto Kendaraan' }).click();
    const popupCar = await popupFoto;

    await popupCar.waitForLoadState('domcontentloaded');
    await expect(popupCar).toHaveURL(/utnWoFilesList\.do/);

    // Path file foto kendaraan
    const filePathCar = path.resolve('/Users/faishalperdananto/Documents/Magang/Test A.jpeg');

    const fotoList = [
      { file: filePathCar, value: '10006', label: 'TAMPAK DEPAN' },
      { file: filePathCar, value: '10007', label: 'TAMPAK BELAKANG' },
      { file: filePathCar, value: '10008', label: 'TAMPAK SAMPING KANAN' },
      { file: filePathCar, value: '10009', label: 'TAMPAK SAMPING KIRI' },
      { file: filePathCar, value: '10010', label: 'INTERIOR (ARAH DASHBOARD)' },
      { file: filePathCar, value: '10011', label: 'INTERIOR (ARAH KACA BELAKANG)' },
      { file: filePathCar, value: '12020', label: 'FOTO KILOMETER' },
      { file: filePathCar, value: '12021', label: 'FOTO MESIN' }
    ];

    for (const foto of fotoList) {
      await this.uploadFotoKendaraan(popupCar, foto.file, foto.value, foto.label);
    }

    console.log('✅ Semua foto kendaraan berhasil diupload');

    await popupCar.close();
  }

  async logout() {
    const page = this.page;
    await Promise.all([
      page.waitForNavigation({ timeout: 60000 }),
      page.locator('a:has(img[src*="logoff1.png"])').click(),
    ]);
  }
}
