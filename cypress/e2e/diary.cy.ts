import { activation } from '../pom/activation.pom';
import { container } from '../pom/container.pom';
import { diary } from '../pom/diary.pom';
import { signIn } from '../pom/sign-in.pom';
import { signUp } from '../pom/sign-up.pom';

describe('Diary', () => {
  const createSignUpData = () => {
    const email = `max.mustermann-${new Date().getTime()}@eternal-holidays.at`;
    const password = 'test';

    return {
      basic: { userType: 'customer' as 'customer' },
      detail: {
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
      },
      interests: {
        continents: ['Asia'],
        travelVariation: ['Culture', 'Adventure'],
        favouredDuration: 'weekend',
        comment: 'Nothing special about me',
        travelType: 'group'
      }
    };
  };

  it('should verify diary with sign-up POMs', () => {
    const data = createSignUpData();
    cy.visit('');
    container.clickSignUp();
    signUp.selectUserType('customer');
    signUp.fillInDetail(data.detail);
    signUp.fillInInterests(data.interests);
    signUp.acceptTerms();
    signUp.finish();
    activation.activate('007');
    container.clickSignIn();
    signIn.signIn(data.detail.email, data.detail.password);
    container.clickDiary();
    diary.verify();
  });
});
