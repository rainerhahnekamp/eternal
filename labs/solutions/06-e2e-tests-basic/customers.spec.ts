describe('Customers', () => {
  beforeEach(() => cy.visit(''));

  it('should count the entries', () => {
    cy.get('[data-testid=btn-customers]').click();
    cy.get('[data-testid=row-customer]').should('have.length', 10);
  });

  it('should rename Latitia to Laetitia', () => {
    cy.get('[data-testid=btn-customers]').click();
    cy.contains('[data-testid=row-customer] p', 'Latitia').siblings('.edit').click();
    cy.get('[data-testid=inp-firstname]').clear().type('Laetitia');
    cy.get('button[type=submit]').click();
    cy.get('[data-testid=row-customer]').should('contain.text', 'Laetitia Bellitissa');
  });

  it('should add a new customer', () => {
    cy.get('[data-testid=btn-customers]').click();
    cy.get('[data-testid=btn-customers-add]').click();
    cy.get('[data-testid=inp-firstname]').type('Tom');
    cy.get('[data-testid=inp-name]').type('Lincoln');
    cy.get('[data-testid=sel-country]').click().get('mat-option').contains('USA').click();
    cy.get('[data-testid=date-birthdate]').type('12.10.1995');
    cy.get('[data-testid=btn-submit]').click();
    cy.get('[data-testid=btn-customers-next]').click();
    cy.get('[data-testid=btn-customers-next]').click();

    cy.get('div').should('contain.text', 'Tom Lincoln');
  });
});
