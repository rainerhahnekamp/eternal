describe('Component Tests', () => {
  it('should mock', () => {
    cy.intercept('https://nominatim.openstreetmap.org/**', {
      body: []
    });

    cy.visit('http://localhost:4400/iframe.html?id=eternal-requestinfo');
    cy.getByAttr('address').type('Domgasse 5');
    cy.getByAttr('btn-search').click();
    cy.getByAttr('lookup-result').should('contain', 'Address not found');
  });

  it('Domgasse 5 succeeds', () => {
    cy.visit('http://localhost:4400/iframe.html?id=eternal-requestinfo');
    cy.getByAttr('address').type('Domgasse 5');
    cy.getByAttr('btn-search').click();
    cy.contains('Brochure sent');
  });

  it('Domgasse does not succeed', () => {
    cy.visit('http://localhost:4400/iframe.html?id=eternal-requestinfo');
    cy.getByAttr('address').type('Domgasse');
    cy.getByAttr('btn-search').click();
    cy.contains('Brochure sent');
  });
});
