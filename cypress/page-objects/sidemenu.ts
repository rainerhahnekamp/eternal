export class Sidemenu {
  open(name: string) {
    cy.findByRole('link', { name }).click();
  }
}

export const sidemenu = new Sidemenu();
