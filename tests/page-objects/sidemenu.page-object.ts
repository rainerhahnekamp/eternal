import { Page } from '@playwright/test';
import { CustomersPage } from './customers-page';
import { HolidaysPage } from './holidays-page';

export class SidemenuPageObject {
  constructor(private page: Page) {}

  open(item: 'Customers'): Promise<CustomersPage>;
  open(item: 'Holidays'): Promise<HolidaysPage>;
  async open(item: 'Customers' | 'Holidays') {
    const fixture =
      item === 'Customers'
        ? new CustomersPage(this.page)
        : new HolidaysPage(this.page);
    await this.page.getByRole('link', { name: item, exact: true }).click();
    return fixture;
  }
}
