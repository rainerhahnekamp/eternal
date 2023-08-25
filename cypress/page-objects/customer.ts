import { format } from 'date-fns';

class Customer {
  setFirstname(firstname: string) {
    cy.findByLabelText('Firstname').clear().type(firstname);
  }

  setName(name: string) {
    cy.findByLabelText('Name').clear().type(name);
  }

  setCountry(country: string) {
    cy.findByLabelText('Country').click();
    cy.findByRole('option', { name: country }).click();
  }

  setBirthday(date: Date) {
    cy.findByLabelText('Birthdate').clear().type(format(date, 'dd.MM.yyyy'));
  }

  submit() {
    cy.findByRole('button', { name: 'Save' }).click();
  }
}

export const customer = new Customer();
