import { Page } from '@playwright/test';

export class ShellPageObject {
  constructor(private page: Page) {}

  getLink(name: 'Customers' | 'Holidays') {
    return this.page.getByRole('link', { name, exact: true });
  }

  async selectMenuItem(name: 'Customers' | 'Holidays') {
    await this.getLink(name).click();
  }
}
