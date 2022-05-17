import { formly } from '../util/formly';

class SignIn {
  signIn(email: string, password: string) {
    formly.fillIn({ email, password }, {}, 'app-sign-in');
    cy.testid('btn-sign-in-submit').click();
    cy.testid('sign-in-successful');
  }
}

export const signIn = new SignIn();
