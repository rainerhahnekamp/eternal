import { formly } from '../util/formly';

class Customers {
  country: string;
  birthdate: Date;

  open() {
    return cy.getByAttr('btn-customers').click();
  }

  navigateBack() {
    return cy.getByAttr('btn-customers-back').click();
  }

  navigateNext() {
    return cy.getByAttr('btn-customers-next').click();
  }

  verifyCustomer(customer: string) {
    return cy.getByAttr('row-customer').should('contain', customer);
  }

  verifyCustomerDoesNotExist(customer: string) {
    return cy.getByAttr('row-customer').should('not.contain', customer);
  }

  clickCustomer(customer: string) {
    this.verifyCustomer(customer);
    cy.get('div').contains(customer).siblings('.edit').click();
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

  navigateToEnd() {
    cy.getByAttr('btn-customers-next').as('button');
    const nextWhenEnabled = () =>
      cy
        .get('@button')
        .invoke('prop', 'disabled')
        .then((isDisabled) => {
          if (!isDisabled) {
            cy.get('@button').click();
            return nextWhenEnabled();
          }
        });
    nextWhenEnabled();
  }
}

export const customers = new Customers();
