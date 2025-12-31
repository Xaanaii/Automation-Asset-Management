import { Page, expect } from '@playwright/test';
import path from 'path';
import { ppkNumberAuction } from '../data/ppkNumber';

export class PendingHDLHO {
  constructor(private readonly page: Page) {}

  // =========================
  // PUBLIC FLOW
  // =========================
  async navigateToPendingHDLHO() {
    await this.openMenu();
    await this.searchPPK();

    const docPopup = await this.openDocPopup();
    await this.uploadAllDocuments(docPopup);
    await this.closeDocPopup(docPopup);

    await this.releaseTransit();
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
    await this.page.locator('#inputValue').fill(ppkNumberAuction);
    await this.page.getByRole('button', { name: 'Search' }).click();

    await expect(this.page.getByText(ppkNumberAuction)).toBeVisible();
    await this.page.locator('input[name="check"]').check();
  }

  // =========================
  // DOC POPUP
  // =========================
  private async openDocPopup(): Promise<Page> {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.page.locator('img[title="Doc"]').click(),
    ]);

    await popup.waitForLoadState('domcontentloaded');
    await expect(popup).toHaveURL(/docReleaseTransit\.do/);

    return popup;
  }

  // =========================
  // UPLOAD DOCUMENT
  // =========================
  private async uploadDocument(
    popup: Page,
    filePath: string,
    categoryValue: string,
    label: string
  ) {
    await popup
      .locator('input[name="documentFile"]')
      .setInputFiles(filePath);

    await popup.locator('#idCategory').selectOption(categoryValue);

    await Promise.all([
      popup
        .locator('table')
        .filter({ hasText: label })
        .first()
        .waitFor({ state: 'visible' }),
      popup.locator('input[value="Add"]').click(),
    ]);
  }

  // =========================
  // UPLOAD ALL DOCUMENTS
  // =========================
  private async uploadAllDocuments(popup: Page) {
    const filePath = path.resolve(
      'C:\\Users\\25109001\\Documents\\Asset Management\\test A.jpg'
    );

    const documents = [
      { value: '10006', label: 'TAMPAK DEPAN' },
      { value: '10007', label: 'TAMPAK BELAKANG' },
      { value: '10008', label: 'TAMPAK SAMPING KANAN' },
      { value: '10009', label: 'TAMPAK SAMPING KIRI' },
      { value: '10010', label: 'INTERIOR (ARAH DASHBOARD)' },
      { value: '10011', label: 'INTERIOR (ARAH KACA BELAKANG)' },
      { value: '12020', label: 'FOTO KILOMETER' },
      { value: '12021', label: 'FOTO MESIN' },
      { value: '10019', label: 'BAST' },
      { value: '10020', label: 'BUKTI PENGAMBILAN/PENYERAHAN KENDARAAN'},
    ];

    for (const doc of documents) {
      await this.uploadDocument(popup, filePath, doc.value, doc.label);
    }
  }

  // =========================
  // CLOSE DOC POPUP
  // =========================
  private async closeDocPopup(popup: Page) {
    await Promise.all([
      popup.waitForEvent('close'),
      popup.locator('input[value="Close"]').click(),
    ]);
  }

  // =========================
  // RELEASE TRANSIT
  // =========================
  private async releaseTransit() {
    const releaseButton = this.page.locator(
      'input.Button[value="Release Transit"]'
    );

    await Promise.all([
      this.page.waitForEvent('dialog').then(dialog => dialog.accept()),
      releaseButton.click(),
    ]);
  }
}
