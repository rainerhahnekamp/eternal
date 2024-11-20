// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    findByRole(role: string, textMatch: string | RegExp): Chainable<JQuery>;

    testid(selector: string): Chainable<JQuery>;

    login(username: string, password: string): void;
  }
}

Cypress.Commands.addQuery('testid', (selector) => {
  const cyGetSync = cy.now('get', `[data-testid=${selector}]`) as () => unknown;

  return () => {
    return cyGetSync();
  };
});

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.session(username, () => {
    cy.visit('');
    cy.findByText('Application is ready').should('be.visible');

    cy.findByRole('button', { name: 'Sign In' }).click();
    cy.origin(
      'https://auth.eternal-holidays.net:8443',
      { args: { username, password } },
      ({ username, password }) => {
        cy.log(username);
        cy.log(password);
        cy.get('#username').type(username);
        cy.get('#password').type(password);
        cy.get('#kc-login').click();
      },
    );

    cy.findByText('Welcome John List').should('be.visible');
  });
});
