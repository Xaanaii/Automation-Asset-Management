import { Page, expect } from '@playwright/test';
import { ppkNumber } from '../data/ppkNumber';

export class DirutPage {
  constructor(private readonly page: Page) {}

  // =========================
  // PUBLIC FLOW
  // =========================
  async navigateToDirut() {
    await this.openMenu();
    await this.searchPPK();
    await this.approveBidder();
  }

  // =========================
  // MENU NAVIGATION
  // =========================
  private async openMenu() {
    await this.page.getByText('Asset Management').click();
    await this.page.getByText('Entry').click();
    await this.page.getByText('Approval Bidder Page').first().click();
  }

  // =========================
  // SEARCH PPK
  // =========================
  private async searchPPK() {
    await this.page.locator('input[name="ppk"]').fill(ppkNumber);
    await this.page.getByRole('button', { name: 'Search' }).click();

    await expect(this.page.getByText(ppkNumber)).toBeVisible({
      timeout: 60000,
    });
  }

  // =========================
  // APPROVAL FLOW
  // =========================
  private async approveBidder() {
    await expect(this.page).toHaveURL(
      /assetManagementUtn\/approvalBidderPage\.do/
    );

    await this.page.locator('input[name="check"]').check();

    const approveButton = this.page.locator(
      'input.Button[type="button"][onclick*="APPROVE"]'
    );

    await expect(approveButton).toBeVisible({ timeout: 60000 });

    await Promise.all([
      this.page.waitForEvent('dialog').then(dialog => dialog.accept()),
      approveButton.click(),
    ]);
  }
}
