import { Page } from '@playwright/test';

export class ShellPageObject {
  constructor(private page: Page) {}

  async openItem(name: 'Holidays' | 'Customers') {
    await this.page.getByRole('link', { name, exact: true }).click();
  }
}
