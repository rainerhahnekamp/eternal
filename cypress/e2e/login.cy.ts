describe('login', () => {
  it('should login', () => {
    cy.login('john.list', 'John List');

    cy.visit('');
    cy.contains('Application is ready');
    cy.get('p').should('contain.text', 'Welcome John List');
  });

  it('should still be logged in', () => {
    cy.login('john.list', 'John List');

    cy.visit('');
    cy.contains('Application is ready');
    cy.get('p').should('contain.text', 'Welcome John List');
  });
});
