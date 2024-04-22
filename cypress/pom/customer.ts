import { format } from 'date-fns';

class Customer {
  setFirstname(firstname: string) {
    cy.testid('inp-firstname').clear().type(firstname);
  }

  setName(name: string) {
    cy.testid('inp-name').clear().type(name);
  }

  setCountry(country: string) {
    cy.testid('sel-country').click();
    cy.testid('opt-country').contains(country).click();
  }

  setBirthday(date: Date) {
    cy.testid('inp-birthdate').clear().type(format(date, 'dd.MM.yyyy'));
  }

  submit() {
    cy.testid('btn-submit').click();
  }
}

export const customer = new Customer();
