import Chainable = Cypress.Chainable;
import { customer } from './customer';

export class Customers {
  clickCustomer(customer: string) {
    this.goTo(customer);

    cy.contains('[data-testid=row-customer]', customer)
      .find('[data-testid=btn-edit]')
      .click();
  }

  open() {
    cy.testid('btn-customers').click();
  }

  add() {
    cy.testid('btn-customers-add').click();
  }

  delete() {
    cy.get('button').contains('Delete').click();
  }

  submitForm(
    firstname: string,
    name: string,
    country: string,
    birthdate: Date,
  ) {
    customer.setFirstname(firstname);
    customer.setName(name);
    customer.setCountry(country);
    customer.setBirthday(birthdate);
    customer.submit();
  }

  goTo(customer: string) {
    this.verifyCustomer(customer);
  }

  goToEnd() {
    const fn = (hasNextPage: boolean) => {
      if (hasNextPage) {
        this.nextPage().then(fn);
      }
    };
    this.nextPage().then(fn);
  }

  verifyCustomerDoesNotExist(customer: string) {
    const checkOnPage = (hasNextPage: boolean) => {
      return cy
        .get('[data-testid=row-customer] [data-testid=name]')
        .then(($names) => {
          const exists = Cypress._.some(
            $names.toArray(),
            ($name) => $name.textContent === customer,
          );

          if (exists) {
            throw new Error(`Customer ${customer} does exist`);
          }

          if (hasNextPage) {
            this.nextPage().then(checkOnPage);
          }
        });
    };

    cy.get('mat-paginator')
      .find('.mat-mdc-paginator-navigation-next')
      .then(($button) => {
        const isDisabled = $button.prop('disabled');
        checkOnPage(!isDisabled);
      });
  }

  verifyCustomer(customer: string) {
    const checkOnPage = (hasNextPage: boolean) =>
      cy.get('[data-testid=row-customer] [data-testid=name]').then(($names) => {
        const exists = Cypress._.some(
          $names.toArray(),
          ($name) => ($name.textContent || '').trim() === customer,
        );
        cy.log(String(exists));
        if (!exists) {
          if (hasNextPage) {
            this.nextPage().then(checkOnPage);
          } else {
            throw new Error(`Customer ${customer} does not exist`);
          }
        }
      });

    cy.testid('row-customer').should('have.length.greaterThan', 0);
    cy.get('mat-paginator')
      .find('.mat-mdc-paginator-navigation-next')
      .then(($button) => {
        const isDisabled = $button.prop('disabled');
        checkOnPage(!isDisabled);
      });
  }

  private nextPage(): Chainable<boolean> {
    cy.get('mat-paginator')
      .find('.mat-mdc-paginator-navigation-next')
      .as('button');
    cy.get('[data-testid=row-customer]:first() [data-testid=name]').as(
      'firstCustomerName',
    );

    return cy.get('@button').then(($button) => {
      const isDisabled = $button.attr('aria-disabled');
      if (!isDisabled) {
        return cy.get('@firstCustomerName').then((firstName) => {
          const name = firstName.text();
          cy.get('@button').click();
          cy.get('@firstCustomerName').should('not.contain', name);
          return cy.wrap(true);
        });
      } else {
        return cy.wrap(false);
      }
    });
  }
}

export const customers = new Customers();
