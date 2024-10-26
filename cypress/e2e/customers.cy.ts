describe('Customers', () => {
  beforeEach(() => {
    cy.visit('');
    cy.testid('hydrated').should('contain.text', 'Application is ready');
  });

  it('should count the entries', () => {
    cy.testid('btn-customers').click();
    cy.testid('row-customer').should('have.length', 10);
  });

  it('should rename Latitia to Laetitia', () => {
    cy.testid('btn-customers').click();
    cy.contains('[data-testid=row-customer]', 'Latitia')
      .find('[data-testid=btn-edit]')
      .click();
    cy.testid('inp-firstname').clear().type('Laetitia');
    cy.testid('btn-submit').click();

    cy.testid('row-customer').should('contain.text', 'Laetitia Bellitissa');
  });

  it('should add a new customer', () => {
    cy.testid('btn-customers').click();
    cy.testid('btn-customers-add').click();
    cy.testid('inp-firstname').type('Tom');
    cy.testid('inp-name').type('Lincoln');
    cy.testid('sel-country').click();
    cy.testid('opt-country').contains('USA').click();
    cy.testid('inp-birthdate').type('12.10.1995');
    cy.testid('btn-submit').click();
    cy.get('mat-paginator').find('.mat-mdc-paginator-navigation-next').click();

    cy.testid('row-customer').should('contain.text', 'Tom Lincoln');
  });
});
