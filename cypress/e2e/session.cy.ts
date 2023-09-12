describe('Session', () => {
  it('should reuse the session', () => {
    cy.login();
    cy.visit('');
    cy.testid('p-username').should('have.text', 'Welcome John List');
  });

  it('should not reuse the session', () => {
    cy.visit('');
    cy.testid('p-username').should('not.exist');
  });
});
