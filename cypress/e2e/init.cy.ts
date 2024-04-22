describe('init', () => {
  it('should rename Latitia to Laetitia', () => {
    cy.visit('');
    cy.testid('btn-customers').click();
    cy.contains('[data-testid=row-customer]', 'Latitia')
      .find('[data-testid=btn-edit]')
      .click();
    cy.get('[data-testid=inp-firstname]').clear().type('Laetitia');
    cy.get('[data-testid=btn-submit]').click();

    cy.get('[data-testid=row-customer]')
      .should((rows) => {
        expect(rows.length).to.eq(10);
      })
      .and('contain.text', 'Laetitia');
  });
});
