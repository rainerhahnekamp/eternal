import { holidaysPageObject } from "./holidays.page-object";
import { customersPageObject } from "./customers.page-object";


class Shell {
  open(name: 'Holidays'): typeof holidaysPageObject;
  open(name: 'Customers'): typeof customersPageObject;
  open(name: 'Holidays' | 'Customers') {
    cy.findByRole('link', {name}).click()
    return name === 'Holidays'? holidaysPageObject : customersPageObject;
  }
}
export const shell = new Shell();
