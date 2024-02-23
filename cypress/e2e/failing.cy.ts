describe('Buggy Tests', () => {
  beforeEach(() => {
    cy.visit('');
  });

  it('should rename Angelika Hoffmann to Angelika Hofmann', () => {
    cy.testid('btn-customers').click();
    cy.contains('[data-testid=row-customer]', 'Angelika Hoffmann')
      .find('[data-testid=btn-edit]')
      .click();
    cy.testid('inp-name').should('have.value', 'Hoffmann')
    cy.testid('inp-name').clear()
    cy.testid('inp-name').type('Hofmann');
    cy.testid('btn-submit').click();

    cy.testid('row-customer').should('contain.text', 'Angelika Hofmann');
  });

  it('should remove Knut Eggen', () => {
    cy.testid('btn-customers').click();
    cy.contains('[data-testid=row-customer]', 'Knut Eggen')
      .find('[data-testid=btn-edit]')
      .click();
    cy.testid('btn-delete').click()
    cy.testid('row-customer').should('have.length', 10)
    cy.testid('row-customer').should('not.contain.text', 'Knut Eggen');
  });

  it('should toggle the loading indicator', () => {
    cy.testid('btn-holidays').click();
    cy.testid('loading-indicator').should('be.visible');
    cy.testid('loading-indicator').should('not.exist');
  });
});
