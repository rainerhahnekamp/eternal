class Sidemenu {
  open(name: 'Customers' | 'Holidays') {
    return cy.get('mat-drawer a').contains(name).click();
  }
}

export const sidemenu = new Sidemenu();
