import { Page } from '@playwright/test';
import { CustomersPage } from './customers-page';
import { HolidaysPage } from './holidays-page';

export class SidemenuPage {
  constructor(private page: Page) {}

  select(item: 'Customers'): Promise<CustomersPage>;
  select(item: 'Holidays'): Promise<HolidaysPage>;
  async select(item: 'Customers' | 'Holidays') {
    const fixture =
      item === 'Customers'
        ? new CustomersPage(this.page)
        : new HolidaysPage(this.page);
    await this.page.getByRole('link', { name: item, exact: true }).click();
    return fixture;
  }
}
