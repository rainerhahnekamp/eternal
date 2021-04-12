class Activation {
  activate(code: string) {
    cy.get('app-activate input').type(code);
    cy.get('app-activate button[type=submit]').click();
    cy.getByAttr('activated');
  }
}

export const activation = new Activation();
