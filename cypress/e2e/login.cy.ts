describe('authentication', () => {
  it('should login', () => {
    cy.login('admin');
    cy.visit('');
    cy.findByText('Welcome John List').should('be.visible');
  });

  it.skip('should be signed in', () => {
    // cy.login();
    cy.visit('');
    cy.findByText('Welcome John List').should('be.visible');
  });
});
