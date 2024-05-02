


export const sidemenu = {
  open(name: 'Holidays' | 'Customers') {
    cy.findByRole('link', {name: name}).click()
  }
}
