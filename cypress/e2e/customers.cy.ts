import ViewportPreset = Cypress.ViewportPreset;

describe('Customers', () => {
  beforeEach(() => {
    cy.visit('');
  });

  (
    ['ipad-2', 'ipad-mini', 'iphone-6', 'samsung-s10'] as ViewportPreset[]
  ).forEach((preset) => {
    it(`should count the entries in ${preset}`, () => {
      cy.viewport(preset);
      cy.visit('');
      cy.testid('btn-customers').click();
      cy.testid('row-customer').should('have.length', 10);
    });
  });

  it('should rename Latitia to Laetitia', () => {
    cy.testid('btn-customers').click();
    cy.contains('[data-testid=row-customer]', 'Latitia')
      .find('[data-testid=btn-edit]')
      .click();
    cy.testid('inp-firstname').clear().type('Laetitia');
    cy.testid('btn-submit').click();

    cy.testid('row-customer').should('contain.text', 'Laetitia Bellitissa');
  });

  it('should add a new customer', () => {
    cy.findByRole('link', { name: 'Customers' }).click();
    cy.findByRole('link', { name: 'Add Customer' }).click();
    cy.findByLabelText('Firstname').type('Tom');
    cy.findByLabelText('Name').type('Lincoln');
    cy.findByLabelText('Country').click();
    cy.findByRole('option', { name: 'USA' }).click();
    cy.findByLabelText('Birthdate').type('12.10.1995');
    cy.findByRole('button', { name: 'Save' }).click();
    cy.findByRole('button', { name: 'next' }).click();

    cy.findByLabelText('Tom Lincoln').should('be.visible');
  });
});
