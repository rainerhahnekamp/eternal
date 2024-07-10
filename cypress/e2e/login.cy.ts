describe('login', () => {
  it('should login', () => {
cy.login()
  });

  it('should be logged in', () => {
    cy.login()
    cy.visit('');
    cy.findByText('Welcome John List').should('be.visible');
  });

  it('should not be logged in', () => {
    cy.visit('');
    cy.findByText('Welcome to Eternal').should('be.visible');
    cy.findByText('Welcome John List').should('not.exist');
  });
});
