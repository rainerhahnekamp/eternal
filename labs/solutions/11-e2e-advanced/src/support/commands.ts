import Chainable = Cypress.Chainable;

declare namespace Cypress {
  interface Chainable<Subject> {
    getByAttr(selector: string): Chainable<Element>;

    getContains(selector: string, contains: string): Chainable;
  }
}

Cypress.Commands.add('getByAttr', (selector) => cy.get(`[data-test=${selector}]`));
Cypress.Commands.add(
  'getContains',
  (selector: string, contains: string): Chainable => {
    cy.get(selector).should('contain', contains);
    return cy.get(selector).contains(contains);
  }
);
