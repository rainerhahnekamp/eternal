import { Page, expect } from '@playwright/test';

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

  async navigateToPage(name: string): Promise<void> {
    // ensure we have rows
    await this.rowsLocator.first().waitFor();

    // fetch all names of currently displayed customers
    const names = await this.rowsLocator
      .locator('data-testid=name')
      .allTextContents();
    const hasCustomer = names.some((value) => value.trim() === name);

    // return if customer is shown
    if (hasCustomer) {
      return;
    }

    // throw error if we are on last page and customer not found
    const nextButton = this.page.getByRole('button', { name: 'Next' });
    if (await nextButton.isDisabled()) {
      throw new Error('Customer could not be found');
    }

    // switch to next page
    const firstName = names[0].trim();
    await nextButton.click();
    await expect(this.rowsLocator.first()).not.toContainText(firstName);

    // repeat until customer is found
    await this.navigateToPage(name);
  }
}
