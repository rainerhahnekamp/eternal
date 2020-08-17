describe('testing', () => {
  beforeEach(() => cy.visit('/iframe.html?id=addresscomponent--primary'));

  it('should render the component', () => {
    cy.get('eternal-address').should('exist');
  });
});
