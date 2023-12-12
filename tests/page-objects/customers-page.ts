import { Page } from '@playwright/test';
import { CustomerPage } from './customer-page';

export class CustomersPage {
  constructor(private page: Page) {}

  rowsLocator = this.page.getByTestId('row-customer');

  rowByName(name: string) {
    return this.page.getByLabel(name);
  }

  async add(): Promise<CustomerPage> {
    const customerPage = new CustomerPage(this.page);
    await this.page.getByRole('link', { name: 'Add Customer' }).click();
    return customerPage;
  }

  async edit(name: string): Promise<CustomerPage> {
    const customerPage = new CustomerPage(this.page);
    await this.page
      .getByLabel(name)
      .getByRole('link', { name: 'Edit' })
      .click();

    return customerPage;
  }
}
