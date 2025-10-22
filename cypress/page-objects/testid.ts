export function testid(selector: string) {
  return cy.get(`[data-testid=${selector}]`);
}
