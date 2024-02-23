// eslint-disable-next-line @typescript-eslint/no-namespace
import Chainable = Cypress.Chainable;

declare namespace Cypress {
  interface Chainable<Subject> {
    findByRole(role: string, textMatch: string | RegExp): Chainable<JQuery>;

    testid(selector: string): Chainable<JQuery>;

    openSidemenu(name: 'Customers' | 'Holidays'): void;

    login(): void;
  }
}

Cypress.Commands.addQuery('testid', function (selector: string) {
  const log = Cypress.log({
    name: 'select via data-testid',
    message: `value: ${selector}`,
  });

  return (subject) => {
    const $el = subject
      ? Cypress.$(subject).find(`[data-testid=${selector}]`)
      : Cypress.$(`[data-testid=${selector}]`);

    log.set({
      $el,
      consoleProps: () => ({
        Yielded: $el.length ? $el : 'nothing there',
        Elements: $el.length,
      }),
    });
    return $el;
  };
});

Cypress.Commands.add('openSidemenu', (name: 'Customers' | 'Holidays') => {
  cy.findByRole('link', { name }).click();
});

Cypress.Commands.add('login', () => {
  cy.session('john-list', () => {
    cy.visit('');
    cy.findByRole('button', { name: 'Sign In' }).click();
    const email = 'john.list@host.com';
    const password = 'John List';

    cy.origin(
      'https://dev-xbu2-fid.eu.auth0.com',
      { args: { email, password } },
      ({ email, password }) => {
        cy.get('#1-email').type(email);
        cy.get('#1-password').type(password);
        cy.get('#1-submit').click();
      },
    );

    cy.get('[data-testid=p-username]', { timeout: 10000 }).should(
      'contain.text',
      'Welcome John List',
    );
  }, {cacheAcrossSpecs: true});
})
