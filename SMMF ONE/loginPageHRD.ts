import { Page } from '@playwright/test';

export class LoginPageHRD {
  constructor(private readonly page: Page) {}

  async gotoLoginPage() {
    await this.page.goto('https://sit8.simasfinance.co.id/hrd/logon/form.do');
  }

  async loginHRD(username: string, password: string) {
    await this.page.fill('#userName', username);
    await this.page.fill('input[name="userPass"]', password);
    await this.page.click('input[type="image"][src*="button_login.gif"]');
    await this.page.waitForLoadState('networkidle');
  }
}
