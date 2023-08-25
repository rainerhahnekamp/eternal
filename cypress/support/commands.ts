// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    findByRole(role: string, textMatch: string | RegExp): Chainable<JQuery>;
    testid(selector: string): Chainable<JQuery>;
    login(profile?: 'Standard' | 'Admin'): void;
  }
}

Cypress.Commands.add('testid', (selector) =>
  cy.get(`[data-testid=${selector}]`),
);

Cypress.Commands.add('login', (profile: 'Standard' | 'Admin' = 'Standard') => {
  const username = Cypress.env(`loginUsername${profile}`);
  const password = Cypress.env(`loginPassword${profile}`);

  cy.session(
    { username, password },
    () => {
      cy.visit('');
      cy.findByRole('button', { name: 'Sign In' }).click();
      cy.origin(
        'dev-xbu2-fid.eu.auth0.com/',
        {
          args: {
            username,
            password,
          },
        },
        ({ username, password }) => {
          cy.get('.auth0-lock-input-email').type(username);
          cy.get('.auth0-lock-input-show-password').type(password);
          cy.get('.auth0-lock-submit').click();
        },
      );
      cy.testid('p-username').should('have.text', 'Welcome John List');
    },
    { cacheAcrossSpecs: true, validate: () => {} },
  );
  cy.visit('');
});
