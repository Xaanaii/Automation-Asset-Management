import { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly baseUrl = 'https://simasfinance:kXBVmapJ@sit8.simasfinance.co.id/bo/'; //daily code harus diganti sesuai code di SMMF ONE

  constructor(page: Page) {
    this.page = page;
  }

  async gotoLoginPage() {
    await this.page.goto(this.baseUrl);
  }

  async login(username: string, password: string) {
    await this.page.fill('#userName', username);
    await this.page.fill('#plainText', password);
    await this.page.click('input[name="btnLogin"]');
    await this.page.waitForLoadState('networkidle');
  }
}