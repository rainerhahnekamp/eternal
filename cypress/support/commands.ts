// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    findByRole(role: string, textMatch: string | RegExp): Chainable<JQuery>;
    testid(selector: string): Chainable<JQuery>;
  }
}

Cypress.Commands.add('testid', (selector) =>
  cy.get(`[data-testid=${selector}]`),
);