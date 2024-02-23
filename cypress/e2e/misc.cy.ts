describe('init', () => {
  beforeEach(() => {
    cy.visit('');
  });

  it('should do a sanity check', () => {});

  it.only('should log', () => {
    cy.testid('btn-customers').click();
    cy.testid('btn-customers-add').click();

    cy.task('log', 'Hallo vom Browser').then((result) => {
    });
  });
});
