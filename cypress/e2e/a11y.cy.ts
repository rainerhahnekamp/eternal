it.skip('should do a a11y check', () => {
  cy.visit('');
  cy.injectAxe();
  cy.checkA11y();
});
