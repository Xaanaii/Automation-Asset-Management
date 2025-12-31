import { Page, expect } from '@playwright/test';
import { ppkNumberAuction } from '../data/ppkNumber';

export class TransitUTN {
  private readonly defaultTimeout = 120000;

  constructor(private readonly page: Page) {
    this.page.setDefaultTimeout(this.defaultTimeout);
  }

  async navigateToTransitUTN(
    auctionNumber: string = 'AUC24120001'
  ): Promise<void> {
    await this.openMenu();
    await this.searchPPK();
    await this.sendToBalaiLelang();
    await this.selectAuctionFromPopup(auctionNumber);
    await this.submitAuction();
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
  // SEND TO BALAI LELANG
  // =========================
  private async sendToBalaiLelang() {
    const balaiLelangBtn = this.page.locator(
      'input[type="button"][value="Balai Lelang"]'
    );

    await Promise.all([
      this.page.waitForNavigation({
        url: /assetManagementUtn\/inputAuction\.do/,
      }),
      this.page.waitForEvent('dialog').then(d => d.accept()),
      balaiLelangBtn.click(),
    ]);

    await expect(this.page).toHaveURL(/inputAuction\.do/);
    console.log('✅ Masuk halaman Input Auction');
  }

  // =========================
  // POPUP AUCTION
  // =========================
  private async selectAuctionFromPopup(auctionNumber: string) {
    const popupTrigger = this.page.locator('img[src="/bo/images/popup.gif"]');

    const [popupPage] = await Promise.all([
      this.page.waitForEvent('popup'),
      popupTrigger.click(),
    ]);

    await popupPage.waitForLoadState('domcontentloaded');
    await expect(popupPage).toHaveURL(/popupAuctionList\.do/);

    await popupPage.getByRole('button', { name: 'Search' }).click();
    await popupPage.getByText(auctionNumber).click();

    // ✅ tunggu efek di parent page (BUKAN close popup)
    const nilField = this.page.locator('input[name="nil"]');
    await expect(nilField).toHaveValue(auctionNumber, {
      timeout: this.defaultTimeout,
    });

    console.log(`📌 Auction ${auctionNumber} terpilih`);
  }

  // =========================
  // SUBMIT
  // =========================
  private async submitAuction() {
    await this.page.locator('#buttonSubmit').click();
    console.log('✅ Form Auction berhasil disubmit');
  }
}
