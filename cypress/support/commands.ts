declare namespace Cypress {
  interface Chainable<Subject> {
    getByAttr(selector: string): Chainable<Element>;
  }
}

Cypress.Commands.add('getByAttr', (selector) => cy.get(`[data-test=${selector}]`));
