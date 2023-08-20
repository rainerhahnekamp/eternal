import { Page } from '@playwright/test';

export class SidemenuPage {
  constructor(private page: Page) {}

  async select(menu: 'Customers' | 'Holidays') {
    await this.page.getByRole(`link`, { name: menu }).click();
  }
}
