describe('Customers', () => {
  it('should count the entries', () => {
    cy.visit('');
    cy.get('[data-test=btn-customers]').click();
    cy.get('div.row:not(.header)').should('have.length', 10);
  });

  it('should rename Latitia to Laetitia', () => {
    cy.visit('');
    cy.get('[data-test=btn-customers]').click();
    cy.get('div').should('contain.text', 'Latitia');
    cy.get('div').contains('Latitia').siblings('.edit').click();
    cy.get('.formly-firstname input').clear().type('Laetitia');
    cy.get('button[type=submit]').click();

    cy.get('div').should('contain.text', 'Laetitia Bellitissa');
  });

  it('should add a new customer', () => {
    cy.visit('');
    cy.get('[data-test=btn-customers]').click();
    cy.get('[data-test=btn-customers-add]').click();
    cy.get('input:first').type('Tom');
    cy.get('input:eq(1)').type('Lincoln');
    cy.get('mat-select').click().get('mat-option').contains('USA').click();
    cy.get('input:eq(2)').type('12.10.1995');
    cy.get('button[type=submit]').click();
    cy.get('[data-test=btn-customers-next]').click();
    cy.get('[data-test=btn-customers-next]').click();

    cy.get('div').should('contain.text', 'Tom Lincoln');
  });
});
