// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    testid(selector: string): Chainable<JQuery<HTMLElement>>;
    findByRole(role: string, textMatch: string | RegExp): Chainable<JQuery>;
    holidayCards(): Chainable<JQuery<HTMLElement>>;
  }
}

Cypress.Commands.add('testid', (selector: string) =>
  cy.get(`[data-testid=${selector}]`),
);

Cypress.Commands.add('holidayCards', () =>
  cy.get(`[data-testid=holiday-card]`).should((cards) => {
    expect(cards).to.have.length.greaterThan(0);
    const allImagesLoaded = cards
      .find('img')
      .toArray()
      .every((img) => (img as HTMLImageElement).naturalWidth > 0);

    expect(allImagesLoaded).to.be.true;
  }),
);
