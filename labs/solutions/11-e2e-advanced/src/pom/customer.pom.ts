import Chainable = Cypress.Chainable;
import { format } from 'date-fns';

class Customer {
  setFirstname(firstname: string): Chainable {
    return cy.get('.formly-firstname input').clear().type(firstname);
  }

  setName(name: string): Chainable {
    return cy.get('.formly-name input').clear().type(name);
  }

  setCountry(country: string): Chainable {
    return cy.get('mat-select').click().get('mat-option').contains(country).click();
  }

  setBirthday(date: Date): Chainable {
    return cy.get('.formly-birthdate input').clear().type(format(date, 'dd.MM.yyyy'));
  }

  submit(): Chainable {
    return cy.get('button[type=submit]').click();
  }
}

export const customer = new Customer();
