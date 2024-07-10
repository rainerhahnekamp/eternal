import { createHoliday } from '@app/holidays/model';



import { shell } from "../page-objects/shell.page-object";

describe('init', () => {
  beforeEach(() => {
    cy.visit('');
  });

  it('should rename Latitia to Laetitia', () => {
    cy.testid('btn-customers').click();
    // cy.findByRole('link', { name: 'Customers' }).click();
    cy.findByLabelText(/Latitia/)
      .findByRole('link', { name: 'Edit Customer' })
      .click();
    cy.findByRole('textbox', { name: 'Firstname' }).clear();
    cy.findByRole('textbox', { name: 'Firstname' }).type('Laetitia');
    cy.findByRole('button', { name: 'Save' }).click();
    cy.findByLabelText(/Laetitia/).should('be.visible');
  });

  it('should click on button', () => {
    cy.findByRole('button', { name: 'Click me' }).click();
    cy.findByRole('button', { name: 'Unclick me' }).should('be.visible');
  });

  it('should use fixtures', () => {
    cy.intercept('https://api.eternal-holidays.net/holiday', {fixture: 'holidays.json'})
    cy.openMenu('Holidays')
  })

  it('should intercept holidays', () => {
    let holidaysCount = 0
    cy.intercept('https://api.eternal-holidays.net/holiday', request => {
      request.continue(response => {
        holidaysCount = response.body.length
      })
    }).as('holidayRequest')

    cy.openMenu('Holidays')
    cy.wait('@holidayRequest')
    cy.testid('holiday-card').should($cards => {
      expect($cards).to.have.length(holidaysCount)
    })
  })

  it('should count holidays', () => {
    cy.request('https://api.eternal-holidays.net/holiday').then((response) => {
      const holidaysCount = response.body.length;
      shell.open('Holidays').holidayCards().should('have.length', holidaysCount);
    });
  });

  it('use chained queries', () => {
    cy.get('a').contains('Customers').click();
  })

  it('should save customer names', () => {
    cy.openMenu('Customers');
    cy.testid('row-customer').first().testid('name').then($names => {
      const names: string[] = $names.map((ix, el) => el.textContent?.trim()).toArray();
      cy.task('saveCustomers', names).then(taskResponse => cy.log(String(taskResponse)))
    })

  })
});
