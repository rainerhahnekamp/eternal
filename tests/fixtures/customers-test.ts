import { CustomerPage } from '../page-objects/customer-page';
import { CustomersPage } from '../page-objects/customers-page';
import { test } from '@playwright/test';

export const customersTest = test.extend({
  async customersPage({ page }, use) {
    const customersPage = new CustomersPage(page);
    await use(customersPage);
  },
  async customerPage({ page }, use) {
    const customerPage = new CustomerPage(page);
    await use(customerPage);
  },
});
