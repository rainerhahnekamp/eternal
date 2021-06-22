import { formly } from '../util/formly';

class SignIn {
  signIn(email: string, password: string) {
    formly.fillIn({ email, password }, {}, 'app-sign-in');
    cy.getByAttr('btn-sign-in-submit').click();
    cy.getByAttr('sign-in-successful');
  }
}

export const signIn = new SignIn();
