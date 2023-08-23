describe('Buggy Tests', () => {
  beforeEach(() => {
    cy.visit('');
  });

  it('should rename Angelika Hoffmann to Angelika Hofmann', () => {
    cy.testid('btn-customers').click();
    cy.contains('[data-testid=row-customer]', 'Angelika Hoffmann')
      .find('[data-testid=btn-edit]')
      .click();
    cy.testid('inp-name').clear().type('Hofmann');
    cy.testid('btn-submit').click();

    cy.testid('row-customer').should('contain.text', 'Angelika Hofmann');
  });

  it('should remove Knut Eggen', () => {
    cy.testid('btn-customers').click();
    cy.contains('[data-testid=row-customer]', 'Knut Eggen')
      .find('[data-testid=btn-edit]')
      .click();
    cy.testid('btn-delete').click();
    cy.get('div').should('not.contain.text', 'Knut Eggen');
  });

  it('should toggle the loading indicator', () => {
    cy.testid('btn-holidays').click();
    cy.testid('loading-indicator').should('not.be.visible');
  });
});
