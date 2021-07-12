import { formly } from '../util/formly';

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
    const fn = (hasNextPage: boolean) => {
      if (hasNextPage) {
        this.nextPage().then(fn);
      }
    };
    this.nextPage().then(fn);
  }

  verifyCustomerDoesNotExist(customer: string) {
    const checkOnPage = (hasNextPage: boolean) =>
      cy.get('[data-test=row-customer] p.name').then(($names) => {
        const exists = Cypress._.some($names.toArray(), ($name) => $name.textContent === customer);

        if (exists) {
          throw new Error(`Customer ${customer} does exist`);
        }

        if (hasNextPage) {
          this.nextPage().then(checkOnPage);
        }
      });

    this.nextPage().then(checkOnPage);
  }

  verifyCustomer(customer: string) {
    const checkOnPage = (hasNextPage: boolean) =>
      cy.get('[data-test=row-customer] p.name').then(($names) => {
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

  private nextPage() {
    cy.getByAttr('btn-customers-next').as('button');
    cy.get('[data-test=row-customer]:first() p.name').as('firstCustomerName');

    return cy.get('@button').then(($button) => {
      const isDisabled = $button.prop('disabled');
      if (!isDisabled) {
        cy.get('@firstCustomerName').then((firstName) => {
          const name = firstName.text();
          cy.get('@button').click();
          cy.get('@firstCustomerName').should('not.contain', name);
        });
      } else {
        cy.wrap(false);
      }
    });
  }
}

export const customers = new Customers();
