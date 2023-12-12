import { Page } from '@playwright/test';

export class CustomersPage {
  constructor(private page: Page) {}

  rowsLocator = this.page.getByTestId('row-customer');

  rowByName(name: string) {
    return this.page.getByLabel(name);
  }

  async add(): Promise<void> {
    await this.page.getByRole('link', { name: 'Add Customer' }).click();
  }

  async edit(name: string): Promise<void> {
    await this.page
      .getByLabel(name)
      .getByRole('link', { name: 'Edit' })
      .click();
  }
}
