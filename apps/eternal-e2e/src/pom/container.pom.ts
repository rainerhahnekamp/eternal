class Container {
  clickSignIn() {
    return cy.testid('btn-sign-in').click();
  }

  clickSignUp() {
    return cy.testid('btn-sign-up').click();
  }

  clickSignOut() {
    return cy.testid('btn-sign-out').click();
  }

  clickDiary() {
    return cy.testid('btn-diary').click();
  }
}

export const container = new Container();
