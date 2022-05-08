describe('Holidays', () => {
  beforeEach(() => cy.visit(''));

  it('should do an implicit subject assertion', () => {
    cy.get('[data-testid=btn-holidays]').should('have.text', 'Holidays');
  });

  it('should do an explicit subject assertion', () => {
    cy.get('[data-testid=btn-holidays]').should(($button) => {
      expect($button).to.have.text('Holidays');
      expect($button).to.have.class('mat-raised-button');
      expect($button).to.have.attr('href', '/holidays');
    });
  });

  it('should stub the holidays', () => {
    cy.intercept('GET', '**/holiday', { fixture: 'holidays.json' });
    cy.visit('');
    cy.getByAttr('btn-holidays').click();
    cy.get('app-holiday-card').should('contain.text', 'Unicorn');
  });
});
