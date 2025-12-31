import { Page, expect } from '@playwright/test';
import { ppkNumberAuction } from '../data/ppkNumber';

export class AuctionDirektur {
  constructor(private readonly page: Page) {}

  // =========================
  // PUBLIC FLOW
  // =========================
  async navigateToAuctionDirektur() {
    await this.openMenu();
    await this.searchPPK();
    await this.approveAuction();
  }

  // =========================
  // MENU NAVIGATION
  // =========================
  private async openMenu() {
    await this.page.getByText('Asset Management').click();
    await this.page.getByText('Entry').click();
    await this.page.getByText('Approval Page Auction').first().click();
  }

  // =========================
  // SEARCH PPK
  // =========================
  private async searchPPK() {
    await this.page.locator('input[name="ppk"]').fill(ppkNumberAuction);
    await this.page.getByRole('button', { name: 'Search' }).click();

    await expect(this.page.getByText(ppkNumberAuction)).toBeVisible({
      timeout: 60000,
    });
  }

  // =========================
  // APPROVAL FLOW
  // =========================
  private async approveAuction() {
    // pastikan sudah di halaman approval Direktur
    await expect(this.page).toHaveURL(
      /assetManagementAuction\/approvalDirekturList\.do/ 
    );

    // checklist
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
