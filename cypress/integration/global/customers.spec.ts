import { customers } from '../../pom/customers.pom';

describe('Customers', () => {
  it('should create and delete the customer', () => {
    cy.visit('');
    const name =
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    customers.open();
    customers.add();
    customers.submitForm('Max', name, 'Austria', new Date(1985, 11, 12));
    customers.navigateToEnd();
    customers.verifyCustomer(name);
  });
});
