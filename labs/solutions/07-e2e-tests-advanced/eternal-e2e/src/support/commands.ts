declare namespace Cypress {
  interface Chainable<Subject> {
    getByAttr(selector: string): Chainable<Element>;

    getContains(selector: string, contains: string): Chainable;
  }
}

Cypress.Commands.add('getByAttr', (selector) => cy.get(`[data-testid=${selector}]`));
Cypress.Commands.add('getContains', (selector: string, contains: string) =>
  cy.get(selector).should('contain.text', contains).contains(contains)
);
