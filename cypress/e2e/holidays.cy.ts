describe('Holidays', () => {
  beforeEach(() => {
    cy.visit('');
  });

  it('should do an implicit subject assertion', () => {
    cy.testid('btn-holidays').should('have.text', 'Holidays');
  });

  it('should verify the holidays link with implicit assertions', () => {
    cy.testid('btn-holidays')
      .should('have.text', 'Holidays')
      .and('have.class', 'mat-mdc-raised-button')
      .and('have.attr', 'href', '/holidays')
      .and('have.css', 'color', 'rgba(0, 0, 0, 0.87)');
  });

  it('should verify the holidays link with explicit assertions', () => {
    cy.testid('btn-holidays').should(($button) => {
      expect($button).to.have.text('Holidays');
      expect($button).to.have.class('mat-mdc-raised-button');
      expect($button).to.have.attr('href', '/holidays');
      expect($button).to.have.css('color', 'rgba(0, 0, 0, 0.87)');
    });
  });

  it('should request brochure for Firenze', () => {
    cy.testid('btn-holidays').click();
    cy.contains('[data-testid.ts=holiday-card]', 'Firenze')
      .find('[data-testid.ts=btn-brochure]')
      .click();
    cy.testid('address').type('Domgasse 5');
    cy.testid('btn-search').click();
    cy.testid('lookup-result').should('contain.text', 'Brochure sent');
  });

  it('should request brochure for Firenze (a11y style)', () => {
    cy.findByRole('link', { name: 'Holidays' }).click();
    cy.findByLabelText(/Florence/)
      .findByRole('link', {
        name: 'Request Brochure',
      })
      .click();

    cy.findByRole('textbox', { name: 'Address' }).type('Domgasse 5');
    cy.findByRole('button', { name: 'Send' }).click();
    cy.findByRole('status').should('contain.text', 'Brochure sent');
  });
});
