import { Page } from '@playwright/test';

export class SidemenuPageObject {
  constructor(private page: Page) {
    console.log('instantiating sidemenu');
  }

  async openItem(name: 'Customers' | 'Holidays') {
    await this.page.getByRole('link', { name, exact: true }).click();
  }
}
