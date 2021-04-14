import { customers } from '../../pom/customers.pom';

describe('Click-Through Test', () => {
  it('the 3 major pages should open correctly', () => {
    cy.visit('');
    cy.get('mat-drawer-content').should('contain', 'Eternal is an imaginary travel agency');
    cy.getByAttr('btn-holidays').click();
    cy.get('mat-drawer-content').should('contain', 'Angkor Wat').and('contain', 'China');
    cy.getByAttr('btn-customers').click();
    cy.get('mat-drawer-content').should('contain', 'Latitia');
  });

  it('customers grid should have three pages', () => {
    cy.visit('');
    customers.open();
    customers.navigateNext();
    customers.navigateNext();
    customers.verifyCustomer('Estefanía Sánchez');
  });
});
