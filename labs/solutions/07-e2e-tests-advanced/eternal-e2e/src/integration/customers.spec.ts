import ViewportPreset = Cypress.ViewportPreset;
import { getHarness } from '@jscutlery/cypress-harness';
import { CustomerComponentHarness } from '../../../eternal/src/app/customer/customer/customer.component.harness';
import { customers } from '../pom/customers.pom';
import { sidemenu } from '../pom/sidemenu.pom';

describe('Customers', () => {
  beforeEach(() => cy.visit(''));

  it('should count the entries', () => {
    cy.get('[data-testid=btn-customers]').click();
    cy.get('div.row:not(.header)').should('have.length', 10);
  });

  it.skip('should rename Latitia to Laetitia', () => {
    cy.get('[data-testid=btn-customers]').click();
    cy.getContains('div', 'Latitia').siblings('.edit').click();
    cy.get('.formly-firstname input').clear().type('Laetitia');
    cy.get('button[type=submit]').click();

    cy.get('div').should('contain.text', 'Laetitia Bellitissa');
  });

  it.skip('should add a new customer', () => {
    sidemenu.open('Customers');
    cy.getByAttr('btn-customers-add').click();
    const harness = getHarness(CustomerComponentHarness);
    harness.setFirstname('Tom');
    harness.setName('Lincoln');
    harness.setCountry('USA');
    harness.setBirthday(new Date(1995, 9, 12));
    harness.save();
    cy.getByAttr('btn-customers-next').click();
    cy.getByAttr('btn-customers-next').click();

    cy.get('div').should('contain.text', 'Tom Lincoln');
  });

  it('should create and delete a customer in an intelligent way', () => {
    const name =
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const fullName = `Max ${name}`;

    cy.visit('');
    customers.open();
    customers.add();
    customers.submitForm('Max', name, 'Austria', new Date(1985, 11, 12));
    customers.clickCustomer(fullName);
    customers.delete();
    customers.verifyCustomerDoesNotExist(fullName);
  });
});

(['ipad-2', 'ipad-mini', 'iphone-6', 'samsung-s10'] as ViewportPreset[]).forEach((preset) => {
  it(`should count the entries in ${preset}`, () => {
    cy.viewport(preset);
    cy.visit('');
    cy.get('[data-testid=btn-customers]').click();
    cy.get('div.row:not(.header)').should('have.length', 10);
  });
});
