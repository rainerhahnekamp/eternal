class Container {
  clickSignIn() {
    return cy.getByAttr('btn-sign-in').click();
  }

  clickSignUp() {
    return cy.getByAttr('btn-sign-up').click();
  }

  clickSignOut() {
    return cy.getByAttr('btn-sign-out').click();
  }
}

export const container = new Container();
