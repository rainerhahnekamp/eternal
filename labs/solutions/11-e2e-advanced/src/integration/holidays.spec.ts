describe('Holidays', () => {
  it('should do an implicit subject assertion', () => {
    cy.visit('');
    cy.get('[data-test=btn-holidays]').should('have.text', 'Holidays');
  });

  it('should do an explicit subject assertion', () => {
    cy.visit('');
    cy.get('[data-test=btn-holidays]').should(($button) => {
      expect($button).to.have.text('Holidays');
      expect($button).to.have.class('mat-raised-button');
      expect($button).to.have.attr('href', '/holidays');
    });
  });

  it('should request more information from for holiday Angkor Wat', () => {
    cy.visit('');
    cy.get('[data-test=btn-holidays]').click();
    cy.getContains('app-holiday-card', 'Angkor Wat').parents('app-holiday-card').find('a').click();
    cy.get('[data-test=address').type('Domgasse 5');
    cy.get('[data-test=btn-search]').click();
    cy.get('[data-test=lookup-result]').contains('Brochure sent');
  });

  it('should stub the holidays', () => {
    cy.intercept('GET', '**/holiday', { fixture: 'holidays.json' });
    cy.visit('');
    cy.getByAttr('btn-holidays').click();
    cy.get('app-holiday-card').should('contain.text', 'Unicorn');
  });
});
