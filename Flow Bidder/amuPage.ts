import { Page, expect } from '@playwright/test';
import { ppkNumber } from '../data/ppkNumber';

export class AmuPage {
  constructor(private readonly page: Page) {}

  // =========================
  // PUBLIC FLOW
  // =========================
  async navigateToAmu() {
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
    await this.page
      .getByText('Approval Page Bidder AMU Dept Head')
      .first()
      .click();
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
    // pastikan sudah di halaman approval AMU
    await expect(this.page).toHaveURL(
      /assetManagementUtn\/approvalPageBidderAmu\.do/
    );

    // checklist bidder
    await this.page.locator('input[name="checkBidder1"]').check();

    const approveButton = this.page.locator(
      'input.Button[type="button"][onclick*="APPROVE"]'
    );

    await expect(approveButton).toBeVisible({ timeout: 10000 });

    await Promise.all([
      this.page.waitForEvent('dialog').then(dialog => dialog.accept()),
      approveButton.click(),
    ]);
  }
}
