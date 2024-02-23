describe('Customers', () => {
  beforeEach(() => {
    cy.visit('');
    cy.testid('btn-customers').as('btnCustomers')
  });

  it('should count the entries', () => {
    cy.get("@btnCustomers").click();
    cy.testid('row-customer').should('have.length', 10);
  });

  it('should rename Latitia to Laetitia', () => {
    cy.get("@btnCustomers").click();
    cy.contains('[data-testid=row-customer]', 'Latitia')
      .find('[data-testid=btn-edit]')
      .click();
    cy.testid('inp-firstname').clear()
    cy.testid('inp-firstname').type('Laetitia');
    cy.testid('btn-submit').click();

    cy.testid('row-customer').should('contain.text', 'Laetitia Bellitissa');
  });

  it('should add a new customer', () => {
    cy.get("@btnCustomers").click();
    cy.testid('btn-customers-add').click();
    cy.testid('inp-firstname').type('Tom');
    cy.testid('inp-name').type('Lincoln');
    cy.testid('sel-country').click();
    cy.testid('opt-country').contains('USA').click();
    cy.testid('inp-birthdate').type('12.10.1995');
    cy.testid('btn-submit').click();
    cy.testid('btn-customers-next').click();

    cy.testid('row-customer').should('contain.text', 'Tom Lincoln');
  });
});
