it('should scrap the customers', () => {
  cy.visit('');
  cy.testid('btn-customers').click();
  cy.testid('row-customer').should('have.length', 10);
  cy.testid('row-customer')
    .find('p:eq(1)')
    .then(($ps) => {
      const customers = [];
      for (let i = 0; i < $ps.length; i++) {
        customers.push($ps.get(i).textContent);
      }
      console.log(customers);
      cy.task('saveCustomers', customers)
    });
});
