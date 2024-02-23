describe('init', () => {
  it('should rename Latita to Laetita', () => {
    cy.visit('');

    cy.findByRole('link', { name: 'Customers' }).click();
    cy.findByLabelText(/latitia/i)
      .findByRole('link', { name: 'Edit Customer' })
      .click();
    cy.findByRole('textbox', { name: /firstname/i })
      .clear()
      .type('Laetitia');
    cy.findByRole('button', { name: 'Save' }).click();

    cy.get('[data-testid=row-customer]').should(($rows) => {
      const names = $rows
        .find('[data-testid=name]')
        .map((ix, element) => element.textContent.trim());
      expect(names.toArray()).to.include('Laetitia Bellitissa');
    });
  });

  it('should click and unclick the button', () => {
    cy.visit('');
    cy.testid('btn-click').click({ force: true });
    cy.testid('btn-click').should('contain.text', 'Unklick mich');
  });

  it.only('should fail', () => {
    cy.visit('')
    cy
    .get('button[role=switch]')
      .first()
      .click();

  })
});
