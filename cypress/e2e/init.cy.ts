describe('Init', () => {
  it.only('should use testid command', () => {
    cy.testid('btn-customers').click();
    cy.task('logInConsole', 'Hello');
    cy.log('Test is finished');
  });

  it('click a button', () => {
    cy.findByRole('button', { name: 'Click me' }).click();
    cy.findByRole('button', { name: 'Unclick me' }).should(
      'contain.text',
      'Unclick me',
    );
  });

  it('should rename Latitia to Laetitia', async () => {
    // cy.viewport('ipad-2');

    cy.testid('hydrated');

    cy.findByRole('link', { name: translate('BTN_CUSTOMERS') }).click();
    cy.findByLabelText(/Latitia/)
      .findByRole('link', { name: 'Edit Customer' })
      .click();

    cy.findByRole('textbox', { name: 'Firstname' }).clear();
    cy.findByRole('textbox', { name: 'Firstname' }).type('Laetitia');
    cy.findByRole('button', { name: 'Save' }).click();
  });

  it('should count the holiday cards', () => {
    cy.request('https://api.eternal-holidays.net/holiday').then((response) => {
      const holidaysCount = response.body.length;
      cy.findByRole('link', { name: 'Holidays' }).click();
      cy.get('[data-testid=holiday-card]').should('have.length', holidaysCount);
    });
  });
});
