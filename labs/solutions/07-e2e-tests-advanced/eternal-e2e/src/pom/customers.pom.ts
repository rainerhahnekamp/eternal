import { formly } from '../util/formly';
import Chainable = Cypress.Chainable;

export class Customers {
  clickCustomer(customer: string) {
    this.goTo(customer);
    cy.get('div').contains(customer).siblings('.edit').click();
  }

  open() {
    return cy.getByAttr('btn-customers').click();
  }

  add() {
    cy.getByAttr('btn-customers-add').click();
  }

  delete() {
    cy.get('button').contains('Delete').click();
  }

  submitForm(firstname: string, name: string, country: string, birthdate: Date) {
    formly.fillIn(
      {
        firstname,
        name,
        country,
        birthdate
      },
      { select: ['country'], date: ['birthdate'] },
      '.app-customer'
    );
    return cy.get('.app-customer button[type=submit]').click();
  }

  goTo(customer: string) {
    this.verifyCustomer(customer);
  }

  goToEnd() {
    const fn: any = (hasNextPage: boolean) => {
      if (hasNextPage) {
        this.nextPage().then(fn);
      }
    };
    this.nextPage().then(fn);
  }

  verifyCustomerDoesNotExist(customer: string) {
    const checkOnPage = (hasNextPage: boolean) => {
      return cy.get('[data-testid=row-customer] p.name').then(($names) => {
        const exists = Cypress._.some($names.toArray(), ($name) => $name.textContent === customer);

        if (exists) {
          throw new Error(`Customer ${customer} does exist`);
        }

        if (hasNextPage) {
          this.nextPage().then(checkOnPage);
        }
      });
    };

    this.nextPage().then(checkOnPage);
  }

  verifyCustomer(customer: string) {
    const checkOnPage = (hasNextPage: boolean) =>
      cy.get('[data-testid=row-customer] p.name').then(($names) => {
        const exists = Cypress._.some($names.toArray(), ($name) => $name.textContent === customer);

        if (!exists) {
          if (hasNextPage) {
            this.nextPage().then(checkOnPage);
          } else {
            throw new Error(`Customer ${customer} does not exist`);
          }
        }
      });

    this.nextPage().then(checkOnPage);
  }

  private nextPage(): Chainable<boolean> {
    cy.getByAttr('btn-customers-next').as('button');
    cy.get('[data-testid=row-customer]:first() p.name').as('firstCustomerName');

    return cy.get('@button').then(($button) => {
      const isDisabled = $button.prop('disabled');
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
