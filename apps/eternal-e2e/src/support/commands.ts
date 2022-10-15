declare namespace Cypress {
  interface Chainable<Subject> {
    testid(selector: string): Chainable<JQuery<HTMLElement>>;
  }
}

Cypress.Commands.add('testid', (selector: string) => cy.get(`[data-testid=${selector}]`));
