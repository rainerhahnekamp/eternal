it('rename Latitia to Laetitia', () => {
  cy.visit('');

  cy.findByTestId('btn-customers').click();
  // cy.testid('btn-customers').click();

  cy.get('[data-testid=row-customer]')
    .find('[data-testid=name]')
    .should(($nameCells) => {
      expect($nameCells).to.have.length(10);
      const names = $nameCells
        .map((ix, nameCell) => nameCell.textContent)
        .toArray()
        .map((name) => name.trim())
        .filter((name) => name.startsWith('Latitia'));

      expect(names).to.have.length(1);
    });
  // TODO
  // cy.get('[data-testid=row-customer]')
  //   .should('', 'Latitia')
  //   .and('have.length', 1);
  cy.contains('[data-testid=row-customer]', 'Latitia')
    .find('[data-testid=btn-edit]')
    .click();
  cy.get('[data-testid=inp-firstname]').clear().type('Laetitia');
  cy.get('[data-testid=btn-submit]').click();

  cy.contains('[data-testid=row-customer]', 'Laetitia');
  cy.get('[data-testid=row-customer]')
    .contains('Laetitia')
    .should('be.visible');
  cy.get('[data-testid=row-customer]').should('contain.text', 'Laetitia'); // Implicit Assertion
});
