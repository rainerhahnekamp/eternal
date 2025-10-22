// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    findByRole(role: string, textMatch: string | RegExp): Chainable<JQuery>;
    testid(selector: string): Chainable<JQuery>;
    openSidemenu(name: 'Holidays' | 'Customers'): void;
    login(profile: 'admin' | 'default'): void;
  }
}

Cypress.Commands.add('testid', (selector) =>
  cy.get(`[data-testid=${selector}]`),
);

Cypress.Commands.add('openSidemenu', (name) => {
  cy.findByRole('link', { name }).click();
});

Cypress.Commands.add('login', (profile) => {
  cy.session(profile, () => {
    cy.visit('');

    cy.findByRole('button', { name: 'Sign In' }).click();
    cy.origin('https://auth.eternal-holidays.net:8443', () => {
      cy.get('#username').type(Cypress.env()['username']);
      cy.get('#password').type(Cypress.env()['password']);
      cy.get('button[type=submit]').click();
    });
    cy.findByText('Welcome John List').should('be.visible');
  });
});
