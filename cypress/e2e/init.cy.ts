describe('init', () => {
  it('should rename Latitia to Laetitia', () => {
    cy.visit('');
    cy.findByRole('link', { name: 'Customers' }).click();

    cy.findByLabelText(/Latitia/)
      .findByRole('link', { name: 'Edit Customer' })
      .click();
    // cy.contains('[data-testid=row-customer]', 'Latitia')
    //   .find('[data-testid="btn-edit"]')
    //   .click();

    cy.get('input').then(($inputs) => {
      const values = { name: '', firstname: '' };
      $inputs.each((ix, input) => {
        const testid = input.getAttribute('data-testid');
        if (testid === 'inp-name') {
          values.name = input.value;
        } else if (testid === 'inp-firstname') {
          values.firstname = input.value;
        }
      });

      console.log(values);
    });
    cy.get('[data-testid=inp-firstname]')
      .clear()
      .type('Laetitia')
      .then((el) => {
        const firstname = el.val() as string;
        cy.get('[data-testid=inp-name]').then((el) => {
          const name = el.val() as string;
          console.log(`${firstname} ${name}`);
        });
      });
    cy.get('[data-testid=btn-submit]').click();

    cy.get('[data-testid=row-customer]').should('contain.text', 'Laetitia');
  });

  it('should not be flaky', () => {
    cy.visit('');
    cy.get('a').as('link');
    cy.get('@link').should('have.attr', 'href');
    cy.get('@link').contains('Customers').click();
  });

  it('should fail', () => {
    cy.visit('');
    cy.testid('btn-click').click();
    cy.testid('btn-click').should('contain.text', 'Unclick me');
  });

  it.only('should verify the holidays', () => {
    let holidaysCount = 0;

    cy.visit('');

    cy.intercept('https://api.eternal-holidays.net/holiday', (request) => {
      request.continue((response) => {
        console.log("before");
        holidaysCount = response.body.length;
        console.log(holidaysCount);
      });
    }).then(() => {
      console.log("after");
      cy.get('app-holiday-card').should(($cards) => {
        expect($cards).to.have.length(holidaysCount);
      });
    });

    cy.testid('btn-holidays').click();
  });
});
