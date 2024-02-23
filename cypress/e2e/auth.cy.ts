describe('authentication', () => {
  it('should authenticate', () => {
    cy.visit('');
    cy.login();
  });

  it('should be authenticated', () => {
    cy.login();
    cy.visit('');

    cy.get('[data-testid=p-username]', { timeout: 10000 }).should(
      'contain.text',
      'Welcome John List',
    );
  });
});
