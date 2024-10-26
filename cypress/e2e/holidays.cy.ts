describe('Holidays', () => {
  beforeEach(() => {
    cy.visit('');
    cy.testid('hydrated').should('contain.text', 'Application is ready');
  });

  it('should do an implicit subject assertion', () => {
    cy.get('[data-testid=btn-holidays]').should('have.text', 'Holidays');
  });

  it('should do an explicit subject assertion', () => {
    cy.get('[data-testid=btn-holidays]').should(($button) => {
      expect($button).to.have.text('Holidays');
      expect($button).to.have.class('mat-mdc-raised-button');
      expect($button).to.have.attr('href', '/holidays');
      expect($button).to.have.css('color', 'rgb(0, 0, 0)');
    });
  });

  it('should request brochure for Firenze', () => {
    cy.get('[data-testid=btn-holidays]').click();
    cy.contains('[data-testid=holiday-card]', 'Firenze')
      .find('[data-testid=btn-brochure]')
      .click();
    cy.testid('address').type('Domgasse 5');
    cy.testid('btn-search').click();
    cy.testid('lookup-result').should('contain.text', 'Brochure sent');
  });

  it('should mock the holidays', () => {
    cy.intercept('GET', '**/holiday', { fixture: 'holidays.json' });
    cy.visit('');
    cy.testid('btn-holidays').click();
    cy.get('app-holiday-card').should('contain.text', 'Unicorn');
  });
});
