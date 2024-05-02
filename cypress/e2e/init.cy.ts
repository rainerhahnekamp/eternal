


it('should rename Latitia to Laetitia', () => {
  cy.visit('')
  cy.testid('btn-customers').click()
  cy.contains('[data-testid=row-customer]', 'Latitia').find('[data-testid=btn-edit]').click()
  cy.get('[data-testid=inp-firstname]').clear().type('Laetitia')
  cy.get('[data-testid=btn-submit]').click()
})
