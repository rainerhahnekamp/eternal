class Sidemenu {
  open(name: 'Customers' | 'Holidays') {
    cy.testid(`btn-${name.toLowerCase()}`).click();
  }
}

export const sidemenu = new Sidemenu();
