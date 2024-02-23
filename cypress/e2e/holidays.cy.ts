describe('Holidays', () => {
  beforeEach(() => {
    cy.visit('');
    cy.findByText('Welcome to Eternal').should('be.visible')
  });

  it('should do an implicit subject assertion', () => {
    cy.testid('btn-holidays').should('have.text', 'Holidays');
  });

  it('should verify the holidays link with implicit assertions', () => {
    cy.testid('btn-holidays')
      .should('have.text', 'Holidays')
      .and('have.class', 'mat-mdc-raised-button')
      .and('have.attr', 'href', '/holidays')
      .and('have.css', 'color', 'rgb(0, 0, 0)');
  });

  it('should verify the holidays link with explicit assertions', () => {
    cy.testid('btn-holidays').should(($button) => {
      expect($button).to.have.text('Holidays');
      expect($button).to.have.class('mat-mdc-raised-button');
      expect($button).to.have.attr('href', '/holidays');
      expect($button).to.have.css('color', 'rgb(0, 0, 0)');
    });
  });

  it.only('should request brochure for Firenze', () => {
    cy.findByRole('link', {name: 'Holidays'  }).click()
    cy.findByLabelText(/Firenze/)
      .findByRole('link', {name: "Get a Brochure"})
      .click();
    cy.findByRole('textbox', {name: "Address"}).type('Domgasse 5');
    cy.findByRole('button', {name: "Send"}).click()
    cy.findByRole('status').should('contain.text', 'Brochure sent')
  });
});
