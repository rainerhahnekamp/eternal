describe('Init', () => {
  it('should rename Latitia to Laetitia', () => {
    cy.visit('');
    cy.contains('Application is ready');
    cy.get('[data-testid="btn-customers"]').click();
    cy.contains('[data-testid=row-customer]', 'Latitia')
      .find('[data-testid=btn-edit]')
      .click();
    cy.get('[data-testid="inp-firstname"]').clear().type('Laetitia');
    cy.get('[data-testid=btn-submit]').click();

    cy.get('[data-testid=row-customer]').should('contain.text', 'Laetitia');
  });
});
