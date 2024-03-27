import { Page } from '@playwright/test';

export type MenuItem = 'Customers' | 'Holidays';

export class ShellPageObject {
  constructor(private page: Page) {}

  async openCustomers() {
    await this.open('Customers');
  }

  async openHolidays() {
    await this.open('Holidays');
  }

  private async open(item: MenuItem) {
    await this.page.getByRole('link', { name: item, exact: true }).click();
  }
}
