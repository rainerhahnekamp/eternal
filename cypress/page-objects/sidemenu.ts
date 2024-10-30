class Sidemenu {
  openMenu(name: string) {
    cy.findByRole('link', { name }).click();
  }
}

export const sidemenu = new Sidemenu();
