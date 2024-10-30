describe('Init', () => {
  beforeEach(() => {
    cy.visit('');
    cy.contains('Application is ready');
  });

  it.only('should rename Latitia to Laetitia', () => {
    // sidemenu.openMenu('Customers');
    cy.testid('block').testid('block');
    cy.openMenu('Customers');

    cy.findByLabelText(/Latitia/)
      .findByRole('link', { name: /Edit/ })
      .click();
    cy.findByRole('textbox', { name: 'Firstname' }).clear();
    cy.findByRole('textbox', { name: 'Firstname' }).type('Laetitia');
    cy.findByRole('button', { name: 'Save' }).click();

    cy.get('[data-testid=row-customer]').should('contain.text', 'Laetitia');

    cy.get('[data-testid=row-customer] [data-testid=name]').then(($names) => {
      cy.task('log', $names.text());
    });
  });

  it('should click button', () => {
    cy.testid('btn-click').click();
    cy.testid('btn-click').should('contain.text', 'Unklick mich');
  });

  it('should do network stuff', () => {
    cy.intercept('');
    cy.request('https://api.eternal-holidays.net/holiday').then((response) => {
      const holidaysCount = response.body.length;
      cy.findByRole('link', { name: 'Holidays' }).click();
      cy.testid('holiday-card').should('have.length', holidaysCount);
    });
  });

  it('should return mocked holidays', () => {
    cy.intercept('https://api.eternal-holidays.net/holiday', {
      fixture: 'holidays.json',
    });
    cy.findByRole('link', { name: 'Holidays' }).click();
    cy.testid('holiday-card').should('have.length', 3);
  });
});
