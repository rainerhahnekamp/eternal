declare namespace Cypress {
  interface Chainable<Subject> {
    getByAttr(selector: string): Chainable<JQuery<HTMLElement>>;
  }
}

Cypress.Commands.add('getByAttr', (selector: string) => cy.get(`[data-testid=${selector}]`));
