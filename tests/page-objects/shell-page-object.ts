import { Page } from '@playwright/test';

export class ShellPageObject {
  constructor(private page: Page) {}

  async clickMenuItem(item: string) {
    await this.page.getByRole('link', { name: item, exact: true }).click();
  }

  async signIn() {
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }
}
