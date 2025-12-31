import { Page } from '@playwright/test';
import { ppkWoUnitDate } from '../data/ppkNumber';

export class WoUnitDate {
  constructor(private readonly page: Page) {}

  /**
   * Method utama yang dipanggil test
   */
  async navigateToWoUnitDate() {
    await this.openMenu();
    await this.chooseTermination();
    await this.chooseCategoryJual();
    await this.submit();
  }

  // -------------------------
  // INTERNAL STEPS (private)
  // -------------------------

  /** Masuk ke menu Finance AR → Entry → Write Off */
  private async openMenu() {
    await this.page.getByText('Finance AR').click({ timeout: 60000 });
    await this.page.getByText('Entry').click({ timeout: 60000 });
    await this.page.getByText('Write Off').first().click({ timeout: 60000 });
  }

  /** Pilih PPK dari dropdown terminationId */
  private async chooseTermination() {
    const optionValue = await this.page
      .locator('select[name="terminationId"] option')
      .filter({ hasText: ppkWoUnitDate })
      .getAttribute('value');

    if (!optionValue) {
      throw new Error(`PPK "${ppkWoUnitDate}" tidak ditemukan`);
    }

    await this.page
      .locator('select[name="terminationId"]')
      .selectOption(optionValue);
  }

  /** Pilih sub kategori "Jual" */
  private async chooseCategoryJual() {
    await this.page
      .locator('select[name="revokeSubCategoryId"]')
      .selectOption({ label: 'CICILAN' });
  }

  /** Klik Submit dan tunggu navigasi */
  private async submit() {
    await Promise.all([
      this.page.waitForNavigation({
        url: /assetForFutureSalesSkalaRentalForm\.do/,
      }),
      this.page.getByRole('button', { name: 'Submit' }).click(),
    ]);
  }
}
