import { Page } from '@playwright/test';

export class CustomersPage {
  constructor(private page: Page) {}

  rowsLocator = this.page.getByTestId('row-customer');

  rowByName(name: string) {
    return this.page
      .getByRole('table', { name: 'customers' })
      .getByRole('rowgroup')
      .last()
      .getByRole('row')
      .filter({ hasText: name });
  }

  async add(): Promise<void> {
    await this.page.getByRole('link', { name: 'Add Customer' }).click();
  }

  async edit(name: string): Promise<void> {
    await this.rowByName(name).getByRole('link', { name: 'Edit' }).click();
  }
}
