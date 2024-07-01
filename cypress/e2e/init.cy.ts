



it('should rename Latitia to Laetitia',  () => {
  cy.visit('');
  cy.testid('btn-customers').click();

  cy.contains('[data-testid=row-customer]', "Latitia").find('[data-testid=btn-edit]').click()

  cy.testid('inp-firstname').clear().type('Laetitia')
  cy.testid('btn-submit').click()

  cy.testid('row-customer').then($rows => {
    console.log($rows)
  })
});
