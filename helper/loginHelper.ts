import { Page } from '@playwright/test';

export async function login(page: Page, username: string, password: string) {
  await page.fill('#userName', username);
  await page.fill('#plainText', password);
  await page.click('input[name="btnLogin"]');
  await page.waitForLoadState('networkidle');
}

export async function loginHRD(page: Page, username: string, password: string) {
  await page.fill('#userName', username);
  await page.fill('input[name="userPass"]', password);
  await page.click('input[type="image"][src*="button_login.gif"]');
  await page.waitForLoadState('networkidle');
}

