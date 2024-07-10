// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    findByRole(role: string, textMatch: string | RegExp): Chainable<JQuery>;

    testid(selector: string): Chainable<JQuery>;

    openMenu(name: 'Holidays' | 'Customers'): void;

    login(profile: 'admin' | 'default'): void;
  }
}

Cypress.Commands.add('login', () => {
  cy.session('login', () => {
    const username = Cypress.env('LOGIN_ADMIN_USERNAME')
    const password = Cypress.env('LOGIN_ADMIN_PASSWORD')

    cy.log(username)
    cy.log(password)

    cy.visit('');
    cy.findByRole('button', { name: 'Sign In' }).click();
    cy.origin('https://dev-xbu2-fid.eu.auth0.com', {args: {username, password}}, (({username, password}) => {
      cy.get('#1-email').type(username);
      cy.get('#1-password').type(password);
      cy.get('#1-submit').click();
    }));

    cy.findByText('Welcome John List').should('be.visible');
  }, {cacheAcrossSpecs: true});
});

Cypress.Commands.addQuery('testid', (selector) => {
  const getFn: () => unknown = cy.now('get', `[data-testid=${selector}]`);
  return (subject) => {
    if (subject) {
      return Cypress.$(subject).find(`[data-testid=${selector}]`);
    } else {
      return getFn();
    }
  };
});

Cypress.Commands.add('openMenu', (name) => {
  cy.findByRole('link', { name }).click();
});
