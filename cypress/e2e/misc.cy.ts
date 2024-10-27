describe('init', () => {
  beforeEach(() => {
    cy.visit('');
    cy.testid('hydrated').should('contain.text', 'Application is ready');
  });

  it('should do a sanity check', () => {});
});
