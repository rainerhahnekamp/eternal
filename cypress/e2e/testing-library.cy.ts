describe('E2E via Testing Library', () => {
  beforeEach('', () => {
    cy.visit('?use-testid=0');
    cy.testid('hydrated').should('contain.text', 'Application is ready');
  });

  it('should request brochure for Firenze', () => {
    cy.findByRole('link', { name: 'Holidays' }).click();

    cy.findByLabelText(/Firenze/i)
      .findByRole('link', { name: 'Request Brochure' })
      .click();
    cy.findByLabelText('Address').type('Domgasse 5');
    cy.findByRole('button', { name: 'Send' }).click();
    cy.findByRole('status', 'Brochure sent');
  });

  it('should rename Latitia to Laetitia', () => {
    cy.findByRole('link', { name: 'Customers' }).click();
    cy.findByLabelText(/Latitia/)
      .findByRole('link', { name: 'Edit Customer' })
      .click();
    cy.findByLabelText('Firstname')
      .should('have.value', 'Latitia')
      .clear()
      .type('Laetitia');
    cy.findByRole('button', { name: 'Save' }).click();

    cy.findAllByRole('link', { name: 'Edit Customer' }).should(
      'have.length',
      10,
    );
    cy.findByLabelText(/Latitia/).should('not.exist');
  });
});
