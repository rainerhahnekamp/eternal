describe('holidays', () => {
  it('should stub the holidays', () => {
    cy.intercept('GET', '**/holiday', { fixture: 'holidays.json' });
    cy.visit('');
    cy.getByAttr('btn-holidays').click();
    cy.contains('Unicorn');
  });
});
