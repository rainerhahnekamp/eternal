// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    testid(selector: string): Chainable<JQuery<HTMLElement>>;
    findByRole(role: string, textMatch: string | RegExp): Chainable<JQuery>;
  }
}

Cypress.Commands.add('testid', (selector: string) => cy.get(`[data-testid=${selector}]`));
