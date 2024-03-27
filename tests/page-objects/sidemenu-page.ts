import { Page } from '@playwright/test';
import { CustomerPage } from './customer-page';
import { HolidaysPageObject } from './holidays-page-object';

export class SidemenuPage {
  constructor(private page: Page) {}

  async select(
    menu: 'Customers' | 'Holidays',
  ): Promise<CustomerPage | HolidaysPageObject> {
    await this.page.getByRole(`link`, { name: menu, exact: true }).click();

    if (menu === 'Customers') {
      return new CustomerPage(this.page);
    } else {
      return new HolidaysPageObject();
    }
  }
}
