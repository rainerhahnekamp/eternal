import ViewportPreset = Cypress.ViewportPreset;
import { sidemenu } from '../pom/sidemenu';
import { customer } from '../pom/customer';
import { customers } from '../pom/customers';

describe('init', () => {
  beforeEach(() => {
    cy.visit('');
    cy.testid('hydrated').should('contain.text', 'Application is ready');
  });

  (
    ['ipad-2', 'ipad-mini', 'iphone-6', 'samsung-s10'] as ViewportPreset[]
  ).forEach((preset) => {
    it(`should count the entries in ${preset}`, () => {
      cy.viewport(preset);
      cy.visit('');
      cy.testid('btn-customers').click();
      cy.testid('row-customer').should('have.length', 10);
    });
  });

  it('should rename Latitia to Laetitia', () => {
    cy.get('[data-testid=btn-customers]').click();
    cy.contains('[data-testid=row-customer]', 'Latitia')
      .find('[data-testid=btn-edit]')
      .click();
    cy.get('[data-testid=inp-firstname]')
      .should('have.value', 'Latitia')
      .clear()
      .type('Laetitia');
    cy.get('[data-testid=btn-submit]').click();

    cy.get('[data-testid=row-customer]').should(
      'contain.text',
      'Laetitia Bellitissa',
    );
  });

  it('should add a new customer', () => {
    sidemenu.open('Customers');
    cy.testid('btn-customers-add').click();
    customer.setFirstname('Tom');
    customer.setName('Lincoln');
    customer.setCountry('USA');
    customer.setBirthday(new Date(1995, 9, 12));
    customer.submit();
    cy.get('mat-paginator').find('.mat-mdc-paginator-navigation-next').click();

    cy.testid('row-customer').should('contain.text', 'Tom Lincoln');
  });

  it('should create and delete a customer in an intelligent way', () => {
    const name =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const fullName = `Max ${name}`;

    customers.open();
    customers.add();
    customers.submitForm('Max', name, 'Austria', new Date(1985, 11, 12));
    customers.clickCustomer(fullName);
    customers.delete();
    customers.verifyCustomerDoesNotExist(fullName);
  });
});
