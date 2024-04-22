



// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    testid(selector: string): Chainable<JQuery<HTMLElement>>;
    findByRole(role: string, textMatch: string | RegExp): Chainable<JQuery>;
    holidayCards(): Chainable<JQuery<HTMLElement>>;
    login(username?: string, password?: string): void;
  }
}

Cypress.Commands.add('testid', (selector: string) =>
  cy.get(`[data-testid=${selector}]`),
);

Cypress.Commands.addQuery('holidayCards', () => {
  const cardsFn = cy.now(
    'get',
    '[data-testid=holiday-card]',
  ) as () => JQuery<HTMLElement>;
  return () => {
    const cards = cardsFn();
    if (cards.length > 0) {
      const allImagesLoaded = cards
        .find('img')
        .toArray()
        .every((img) => (img as HTMLImageElement).naturalWidth > 0);

      if (allImagesLoaded) {
        return cards;
      }
    }
    return null;
  };
});

Cypress.Commands.add('login', (username?: string, password?: string) => {
  if (username === undefined) {
    username = Cypress.env('loginUsername');
  }
  if (password === undefined) {
    password = Cypress.env('loginPassword');
  }

  cy.session(
    { username, password },
    () => {
      cy.visit('');
      cy.testid('btn-sign-in').click();
      cy.origin(
        'dev-xbu2-fid.eu.auth0.com/',
        { args: { username, password } },
        ({ username, password }) => {
          cy.get('.auth0-lock-input-email').type(username || '');
          cy.get('.auth0-lock-input-show-password').type(password || '');
          cy.get('.auth0-lock-submit').click();
        },
      );
      cy.testid('p-username').should('have.text', 'Welcome John List');
    },
    { cacheAcrossSpecs: true },
  );
});
