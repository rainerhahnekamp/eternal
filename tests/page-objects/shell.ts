import { Page } from '@playwright/test';
import { HolidaysPage } from './holidays-page';

export class Shell {
  constructor(private page: Page) {}

  async openCustomers() {
    await this.#openMenu('Customers');
  }

  async openHolidays() {
    await this.#openMenu('Holidays');
  }

  async #openMenu(name: 'Customers' | 'Holidays') {
    await this.page.getByRole('link', { name, exact: true }).click();
  }
}
