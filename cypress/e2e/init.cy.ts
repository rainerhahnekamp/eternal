import { createHoliday } from '@app/holidays/model';
import { sidemenu } from "../pom/sidemenu";

declare function translate(key: string): string;

describe('init', () => {
  it('should rename Latitia to Laetitia', () => {
    cy.visit('');

    cy.get('a').contains('Customers').click();

    cy.findByRole('link', { name: 'Customers' }).click();
    cy.findByLabelText(/Latitia/)
      .findByRole('link')
      .click();
    cy.findByRole('textbox', { name: 'Firstname' }).clear();
    cy.findByRole('textbox', { name: 'Firstname' }).type('Laetitia');
    cy.findByRole('button', { name: 'Save' }).click();

    cy.testid('row-customer').should(($rows) => {
      const nameExists = $rows
        .find('[data-testid=name]')
        .toArray()
        .map((element) => element.textContent || '')
        .some((name) => name.match(/Laetitia/));
      expect(nameExists).to.eq(true);
    });
  });

  it('should click on click me', () => {
    cy.visit('');
    cy.findByRole('button', { name: 'Click me' }).click();
    cy.findByRole('button', { name: 'Unclick me' });
  });

  it.only('should intercept the holidays', () => {
    cy.visit('');
    cy.request('https://api.eternal-holidays.net/holiday').then((response) => {
      const holidaysCount = response.body.length;
      cy.openMenu('Holidays') // Extension of the cy object (officially recommended)
      sidemenu.open('Holidays') // Page Object
      cy.testid('holiday-card').should('have.length', holidaysCount);
    });
  });
});
