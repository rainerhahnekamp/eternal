import { activation } from '../pom/activation.pom';
import { container } from '../pom/container.pom';
import { signIn } from '../pom/sign-in.pom';
import { signUp } from '../pom/sign-up.pom';

describe('Sign-Up', () => {
  it('should sign up', () => {
    const email = `max.mustermann-${new Date().getTime()}@eternal-holidays.at`;
    const password = 'test';
    cy.visit('');
    container.clickSignUp();
    signUp.selectUserType('customer');
    signUp.fillInDetail({
      firstname: 'Max',
      name: 'Mustermann',
      email,
      password,
      passwordConfirm: password,
      street: 'Hauptstraße',
      streetNumber: '12',
      zip: '1001',
      city: 'Wien',
      country: 'Austria',
      birthdate: new Date(1992, 11, 10)
    });
    signUp.fillInInterests({
      continents: ['Asia'],
      travelVariation: ['Culture', 'Adventure'],
      favouredDuration: 'weekend',
      comment: 'Nothing special about me',
      travelType: 'group'
    });
    signUp.acceptTerms();
    signUp.finish();
    activation.activate('007');
    container.clickSignIn();
    signIn.signIn(email, password);
  });
});
