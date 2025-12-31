import { Page, expect } from '@playwright/test';
import { ppkNumberAuction } from '../data/ppkNumber';

export class ReleasePPK {
  constructor(private readonly page: Page) {}

  // =========================
  // PUBLIC FLOW
  // =========================
  async navigateToReleasePPK() {
    await this.openMenu();
    await this.searchPPK();
    await this.openAndSubmitHDLPopup(20000000);
    await this.releasePPK();
  }

  // =========================
  // MENU
  // =========================
  private async openMenu() {
    await this.page.getByText('Asset Management').click();
    await this.page.getByText('Entry').click();
    await this.page
      .getByText('Asset Management UTN Auction')
      .first()
      .click();
  }

  // =========================
  // SEARCH PPK
  // =========================
  private async searchPPK() {
    await this.page.locator('select[name="category"]').selectOption('ppk');
    await this.page.locator('#inputValue').fill(ppkNumberAuction);
    await this.page.getByRole('button', { name: 'Search' }).click();

    await expect(this.page.getByText(ppkNumberAuction)).toBeVisible();
  }

  // =========================
  // INPUT HDL POPUP
  // =========================
  private async openAndSubmitHDLPopup(price: number) {
    // buka popup Input HDL
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.page.locator('img[title="Input HDL"]').click(),
    ]);

    await popup.waitForLoadState('domcontentloaded');
    await expect(popup).toHaveURL(/assetManagementAuction\/input\.do/);

    // isi auction base price
    const priceField = popup.locator('#auctionBasePrice');
    await priceField.fill(price.toString());

    // submit → popup akan close sendiri
    await Promise.all([
      popup.waitForEvent('close'),
      popup.locator('#buttonSubmit').click(),
    ]);
  }

  // =========================
  // RELEASE PPK
  // =========================
  private async releasePPK() {
    // checklist data
    await this.page.locator('input[name="check"]').check();

    const releaseButton = this.page.locator(
      'input[type="button"][value="Send"]'
    );

    await Promise.all([
      this.page.waitForEvent('dialog').then(dialog => {
        console.log('⚠️ Confirm:', dialog.message());
        return dialog.accept();
      }),
      releaseButton.click(),
    ]);

    console.log('✅ Release PPK berhasil');
  }
}
