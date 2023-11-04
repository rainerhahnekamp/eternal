describe('Init', () => {
  it.only('should rename Latitia to Laetitia', () => {
    cy.visit('');
    cy.findByRole('link', { name: 'Customers' }).click();
    cy.findByLabelText(/Latitia/)
      .findByRole('link', { name: 'Edit Customer' })
      .click();

    cy.testid('inp-firstname').clear().type('Laetitia');
    cy.get('[data-testid="btn-submit"]').click();

    cy.get('[data-testid=row-customer]').should('contain.text', 'Laetitia');
    cy.get('div').should('not.contain.text', 'Latitia');
  });

  it('should fail', () => {
    cy.visit('');
    cy.get('a').should('have.attr', 'href');
    cy.get('a').contains('Customers').click();
  });

  it('should cause undetached DOM event', () => {
    cy.visit('');
    cy.testid('btn-click').then((button$) => {
      const requiredText =
        button$.text() === ' Click me ' ? 'Unclick me' : 'Click me';
      cy.testid('btn-click').click();
      cy.testid('btn-click').should('contain.text', requiredText);
    });
  });

  it('should intercept holidays', () => {
    cy.visit('');
    cy.request('https://api.eternal-holidays.net/holiday').as('request');

    cy.get('@request').then((holidays) => {
      cy.findByRole('link', { name: 'Holidays' }).click();
      cy.testid('holiday-card').should('have.length', holidays.body.length);
    });

    cy.get('@request').should(() => expect(true).to.eq(true));
    cy.get('@request').should(() => expect(true).to.eq(true));
    cy.get('@request').should(() => expect(true).to.eq(true));
  });
});
