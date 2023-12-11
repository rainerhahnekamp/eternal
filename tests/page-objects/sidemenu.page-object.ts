import { Page } from '@playwright/test';

export class SidemenuPageObject {
  constructor(private page: Page) {}

  async open(item: 'Customers' | 'Holidays') {
    await this.page.getByRole('link', { name: item, exact: true }).click();
  }
}
