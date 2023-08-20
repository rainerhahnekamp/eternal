import { CustomerPage } from '../page-objects/customer-page';
import { CustomersPage } from '../page-objects/customers-page';
import { Fixture } from './fixture';

export type CustomersFixtures = {
  customersPage: CustomersPage;
  customerPage: CustomerPage;
};

export const customersFixtures: Fixture<CustomersFixtures> = {
  async customersPage({ page }, use) {
    const customersPage = new CustomersPage(page);
    await use(customersPage);
  },
  async customerPage({ page }, use) {
    const customerPage = new CustomerPage(page);
    await use(customerPage);
  },
};
