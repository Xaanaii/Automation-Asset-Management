import { Page, expect } from '@playwright/test';
import { ppkNumber } from '../data/ppkNumber';

export class TekminPage {
  constructor(private readonly page: Page) {}

  // =========================
  // PUBLIC FLOW
  // =========================
  async navigateToTekmin() {
    await this.openMenu();
    await this.searchPPK();
    await this.checkAndSend();
  }

  // =========================
  // MENU NAVIGATION
  // =========================
  private async openMenu() {
    await this.page.getByText('Asset Management').click();
    await this.page.getByText('Entry').click();
    await this.page.getByText('Asset Management UTN Bidder').first().click();
  }

  // =========================
  // SEARCH PPK
  // =========================
  private async searchPPK() {
    await this.page.locator('select[name="category"]').selectOption('ppk');
    await this.page.locator('#inputValue').fill(ppkNumber);
    await this.page.getByRole('button', { name: 'Search' }).click();

    await expect(this.page.getByText(ppkNumber)).toBeVisible({
      timeout: 60000,
    });
  }

  // =========================
  // CHECK & SEND
  // =========================
  private async checkAndSend() {
    await this.page.locator('input[name="check"]').check();

    // pastikan halaman acknowledge
    await expect(this.page).toHaveURL(
      /assetManagementUtn\/acknowledgePage\.do/
    );

    const sendButton = this.page.locator(
      'input[type="button"][value="Send"]'
    );

    await Promise.all([
      this.page.waitForEvent('dialog').then(dialog => dialog.accept()),
      sendButton.click(),
    ]);
  }

}
