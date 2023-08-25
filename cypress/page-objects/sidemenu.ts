class Sidemenu {
  open(name: 'Customers' | 'Holidays') {
    cy.findByRole('link', { name }).click();
  }
}

export const sidemenu = new Sidemenu();
