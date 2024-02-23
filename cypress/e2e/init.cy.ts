import { createHoliday } from '@app/holidays/model';

describe('init', () => {
  it('should rename Latita to Laetita', () => {
    cy.visit('');

    cy.findByRole('link', { name: 'Customers' }).click();
    cy.findByLabelText(/latitia/i)
      .findByRole('link', { name: 'Edit Customer' })
      .click();
    cy.findByRole('textbox', { name: /firstname/i })
      .clear()
      .type('Laetitia');
    cy.findByRole('button', { name: 'Save' }).click();

    cy.get('[data-testid=row-customer]').should(($rows) => {
      const names = $rows
        .find('[data-testid=name]')
        .map((ix, element) => element.textContent.trim());
      expect(names.toArray()).to.include('Laetitia Bellitissa');
    });
  });

  it('should click and unclick the button', () => {
    cy.visit('');
    cy.testid('btn-click').click({ force: true });
    cy.testid('btn-click').should('contain.text', 'Unklick mich');
  });

  it('should fail', () => {
    cy.visit('');
    cy.get('button[role=switch]').first().click();
  });

  it('should do an a11y check', () => {
    cy.visit('');
    cy.findByText('Welcome to Eternal').should('be.visible');

    cy.injectAxe();
    cy.checkA11y();
  });

  it.only('should count the holiday cards', () => {
    cy.visit('');

    cy.request('GET', 'https://api.eternal-holidays.net/holiday').then(
      (response) => {
        const holidaysCount = response.body.length;

        cy.findByRole('link', { name: 'Holidays' }).click();
        cy.get('app-holiday-card').should('have.length', holidaysCount);
      },
    );
  });
});
