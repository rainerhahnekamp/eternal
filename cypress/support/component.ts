import { mount } from 'cypress/angular';
import Chainable = Cypress.Chainable;

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    mount: typeof mount;
    testid(testid: string): Chainable<JQuery>;
  }
}

Cypress.Commands.add('mount', mount);
Cypress.Commands.addQuery('testid', (testid: string) => {
  const getFn = cy.now('get', `[data-testid=${testid}]`) as () => Chainable;
  return () => getFn();
});
