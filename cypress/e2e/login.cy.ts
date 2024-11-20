describe('Login', () => {
  beforeEach(() => {
    cy.visit('');
    cy.findByText('Application is ready').should('be.visible');
  });

  it('should sign in', () => {
    cy.login('john.list', 'John List');
  });

  it('should be signed in', () => {
    cy.login('john.list', 'John List');

    cy.visit('');
    cy.findByText('Application is ready').should('be.visible');
    cy.findByText('Welcome John List').should('be.visible');
  });
});
