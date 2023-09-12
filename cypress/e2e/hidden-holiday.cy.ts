import { sidemenu } from '../pom/sidemenu';

it.skip('should query for holidays', () => {
  cy.visit('');
  sidemenu.open('Holidays');
  cy.holidayCards().contains('Hidden Vienna');
});
