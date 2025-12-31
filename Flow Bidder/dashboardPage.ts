import { Page, expect } from '@playwright/test';
import path from 'path';
import { ppkNumber } from '../data/ppkNumber';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  // =========================
  // PUBLIC FLOW
  // =========================
  async navigateToAssetManagementUTN() {
    await this.openMenu();
    await this.searchPPK();

    const bidPopup = await this.openBidPopup();
    const checklistPopup = await this.openChecklistPopup(bidPopup);

    await this.selectNIB(checklistPopup, 'BID24120001');
    await this.submitBid(bidPopup);

    await this.sendProcess();
  }

  // =========================
  // MENU
  // =========================
  private async openMenu() {
    await this.page.getByText('Asset Management').click();
    await this.page.getByText('Entry').click();
    await this.page.getByText('Asset Management UTN').first().click();
  }

  // =========================
  // SEARCH PPK
  // =========================
  private async searchPPK() {
    await this.page.locator('select[name="category"]').selectOption('ppk');
    await this.page.locator('#inputValue').fill(ppkNumber);
    await this.page.getByRole('button', { name: 'Search' }).click();

    await expect(this.page.getByText(ppkNumber)).toBeVisible();
  }

  // =========================
  // BID POPUP
  // =========================
  private async openBidPopup(): Promise<Page> {
    const [bidPopup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.page.locator('img[title="Bid"]').first().click(),
    ]);

    await bidPopup.waitForLoadState('domcontentloaded');
    return bidPopup;
  }

  // =========================
  // CHECKLIST POPUP
  // =========================
  private async openChecklistPopup(bidPopup: Page): Promise<Page> {
    const [checklistPopup] = await Promise.all([
      bidPopup.waitForEvent('popup'),
      bidPopup.locator('img[title="Document Checklist"]').click(),
    ]);

    await checklistPopup.waitForLoadState('domcontentloaded');
    await checklistPopup.getByRole('button', { name: 'Search' }).click();

    return checklistPopup;
  }

  // =========================
  // SELECT NIB (AUTO CLOSE POPUP)
  // =========================
  private async selectNIB(checklistPopup: Page, nib: string) {
    await Promise.all([
      checklistPopup.waitForEvent('close'),
      checklistPopup.getByText(nib).click(),
    ]);
  }

  // =========================
  // SUBMIT BID
  // =========================
  private async submitBid(bidPopup: Page) {
    await bidPopup.locator('#bid').fill('20000000');

    const filePath = path.resolve(
      'C:\\Users\\25109001\\Documents\\Asset Management\\test A.jpg'
    );

    await bidPopup
      .locator('input[name="fileFormPenawaran"]')
      .setInputFiles(filePath);

    // Submit → popup auto close / fallback cancel
    await Promise.race([
      bidPopup.waitForEvent('close'),
      bidPopup.locator('#buttonSubmit').click(),
    ]);
  }

  // =========================
  // SEND PROCESS
  // =========================
  private async sendProcess() {
    await expect(this.page.getByText(ppkNumber)).toBeVisible();

    await this.page.locator('input[name="check"]').check();

    if (!this.page.url().includes('/assetManagementUtn/list.do')) return;

    const sendButton = this.page.locator('input[value="Send"]');

    await Promise.all([
      this.page.waitForEvent('dialog').then(dialog => dialog.accept()),
      sendButton.click(),
    ]);
  }
}
