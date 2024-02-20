import { Page } from '@playwright/test';
import { CustomersPage } from './customers-page';
import { HolidaysPage } from './holidays-page';

export class SidemenuPage {
  constructor(private page: Page) {}

  async select(item: 'Customers'): Promise<CustomersPage>;
  async select(item: 'Holidays'): Promise<HolidaysPage>;
  async select(
    item: 'Customers' | 'Holidays',
  ): Promise<CustomersPage | HolidaysPage> {
    await this.page.getByRole('link', { name: item, exact: true }).click();

    return item === 'Customers'
      ? new CustomersPage()
      : new HolidaysPage(this.page);
  }
}
