// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    findByRole(role: string, textMatch: string | RegExp): Chainable<JQuery>;

    openMenu(name: 'Customers' | 'Holidays'): void;

    testid(selector: string): Chainable<JQuery>;

    login(profile: 'JOHN' | 'ADMIN'): void;
  }
}

Cypress.Commands.addQuery('testid', (selector) => {
  return (parentElement) => {
    if (parentElement) {
      return Cypress.$(parentElement).find(`[data-testid=${selector}]`);
    } else {
      return Cypress.$(`[data-testid=${selector}]`);
    }
  };
});

Cypress.Commands.add('openMenu', (name: 'Customers' | 'Holidays') => {
  cy.findByRole('link', { name }).click();
});

Cypress.Commands.add('login', (profile: 'JOHN' | 'ADMIN') => {
  const username = Cypress.env('LOGIN_USERNAME');
  const password = Cypress.env('LOGIN_PASSWORD');

  cy.session(`${username}`, () => {
    cy.visit('');
    cy.contains('Application is ready');
    cy.findByRole('button', { name: 'Sign In' }).click();
    cy.origin(
      'https://auth.eternal-holidays.net:8443',
      { args: { username, password } },
      ({ username, password }) => {
        cy.get('#username').type(username);
        cy.get('#password').type(password);
        cy.get('input[type=submit]').click();
      },
    );

    cy.visit('');
    cy.contains('Application is ready');
    cy.get('p').should('contain.text', 'Welcome John List');
  });
});
