it('should rename Latita to Laetita', () => {
  cy.visit('');
  cy.testid('btn-customers').click();
  // cy.get('[data-testid="btn-customers"]').click();
  cy.contains('[data-testid=row-customer]', 'Latitia')
    .find('[data-testid=btn-edit]')
    .click();
  cy.get('[data-testid="inp-firstname"]').clear().type('Laetitia');
  cy.get('[data-testid="btn-submit"]').click();

  cy.get('[data-testid=row-customer]').should(($rows) => {
    const names = $rows
      .find('[data-testid=name]')
      .map((ix, element) => element.textContent.trim());
    expect(names.toArray()).to.include("Laetitia Bellitissa");
  });
});
