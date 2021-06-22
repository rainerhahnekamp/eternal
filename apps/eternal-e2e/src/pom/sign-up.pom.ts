import { DetailData } from '../../../eternal/src/app/security/sign-up/detail/detail.component';
import { InterestsData } from '../../../eternal/src/app/security/sign-up/interests/interests.component';
import { formly } from '../util/formly';

class SignUp {
  selectUserType(userType: 'customer' | 'agent') {
    return cy.getByAttr(`user-type-${userType}`).click();
  }

  fillInDetail(detailData: DetailData) {
    formly.fillIn(
      detailData,
      {
        select: ['country'],
        date: ['birthdate']
      },
      'app-sign-up-detail'
    );
    return cy.getByAttr('btn-sign-up-detail-next').click();
  }

  fillInInterests(interestsData: InterestsData) {
    formly.fillIn(
      interestsData,
      {
        multicheckbox: ['travelVariation'],
        multiSelect: ['continents'],
        radio: ['favouredDuration', 'travelType'],
        textarea: ['comment']
      },
      'app-sign-up-interests'
    );
    return cy.getByAttr('btn-sign-up-interests-next').click();
  }

  acceptTerms() {
    cy.get('.formly-terms').click();
    cy.get('.formly-gdpr').click();
  }

  finish() {
    cy.getByAttr('btn-sign-up-finish').click();
  }
}

export const signUp = new SignUp();
