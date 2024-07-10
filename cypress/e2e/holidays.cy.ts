describe('Holidays', () => {
  beforeEach(() => {
    cy.visit('');
  });

  it(
    'should do an implicit subject assertion',
    { retries: 2 },
    () => {
      cy.testid('btn-holidays').should('have.text', 'Holidays');
    },
  );

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

  it('should request brochure for Firenze', () => {
    cy.testid('btn-holidays').click();
    cy.contains('[data-testid=holiday-card]', 'Firenze')
      .find('[data-testid=btn-brochure]')
      .click();
    cy.testid('ri-address').type('Domgasse 5');
    cy.testid('ri-search').click();
    cy.testid('ri-message').should('contain.text', 'Brochure sent');
  });
});
