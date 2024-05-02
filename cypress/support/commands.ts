// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    findByRole(role: string, textMatch: string | RegExp): Chainable<JQuery>;

    testid(selector: string): Chainable<JQuery>;

    openSidemenu(name: 'Customers' | 'Holidays'): void;

    login(): void;
  }
}

Cypress.Commands.add('testid', (selector) =>
  cy.get(`[data-testid=${selector}]`),
);

Cypress.Commands.add('openSidemenu', (name: 'Customers' | 'Holidays') =>
  cy.findByRole('link', { name }).click(),
);

Cypress.Commands.add('login', () => {
  cy.session('john-list', () => {
    cy.visit('')
    cy.findByRole('button', { name: 'Sign In' }).click();
    cy.origin('https://dev-xbu2-fid.eu.auth0.com', () => {
      cy.get('input[name=email]').type('john.list@host.com');
      cy.get('input[name=password]').type('John List');
      cy.get('button[type=submit]').click();
    });
    cy.findByText('Welcome John List').should('be.visible');
  }, {cacheAcrossSpecs: true});
});
