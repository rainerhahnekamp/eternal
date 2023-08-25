import { sidemenu } from 'cypress/page-objects/sidemenu';
import { Customer } from '@app/customer/customer';
import { customer } from '../page-objects/customer';
import ViewportPreset = Cypress.ViewportPreset;

describe('Customers', () => {
  describe('mocked', () => {
    beforeEach(() => {
      cy.visit('');
    });

    (
      ['ipad-2', 'ipad-mini', 'iphone-6', 'samsung-s10'] as ViewportPreset[]
    ).forEach((preset) => {
      it(`should count the entries in ${preset}`, () => {
        cy.viewport(preset);
        cy.visit('');
        cy.testid('btn-customers').click();
        cy.testid('row-customer').should('have.length', 10);
      });
    });

    it('should rename Latitia to Laetitia', () => {
      cy.testid('btn-customers').click();
      cy.contains('[data-testid=row-customer]', 'Latitia')
        .find('[data-testid=btn-edit]')
        .click();
      cy.testid('inp-firstname').clear().type('Laetitia');
      cy.testid('btn-submit').click();

      cy.testid('row-customer').should('contain.text', 'Laetitia Bellitissa');
    });

    it('should add a new customer', () => {
      sidemenu.open('Customers');
      cy.findByRole('link', { name: 'Add Customer' }).click();
      customer.setFirstname('Tom');
      customer.setName('Lincoln');
      customer.setCountry('USA');
      customer.setBirthday(new Date(1995, 9, 12));
      customer.submit();
      cy.testid('btn-customers-next').click();

      cy.testid('row-customer').should('contain.text', 'Tom Lincoln');
    });
  });

  describe('not-mocked HTTP', () => {
    beforeEach(() => {
      cy.visit('');
      cy.testid('tgl-mock-customers').click();
    });

    it('should not mock the network in customers', () => {
      cy.intercept(
        'GET',
        'https://api.eternal-holidays.net/customers?page=0&pageSize=10',
      ).as('customersRequest');
      cy.findByRole('link', { name: 'Customers' }).click();
      cy.wait('@customersRequest').its('response.statusCode').should('eq', 200);
    });

    it('should use a fixture to mock the customers', () => {
      cy.intercept(
        'GET',
        'https://api.eternal-holidays.net/customers?page=0&pageSize=10',
        {
          fixture: 'customers.json',
        },
      );
      cy.findByRole('link', { name: 'Customers' }).click();
      cy.findByLabelText('Konrad Niedermeyer').should('be.visible');
    });

    it('should verify that the right amount of customers is shown', () => {
      let customersCount: number | undefined = undefined;
      cy.visit('?mock-customers=0');
      cy.intercept('https://api.eternal-holidays.net/customers**', (req) => {
        req.continue((res) => (customersCount = res.body.content.length));
      }).as('customersRequest');

      cy.findByRole('link', { name: 'Customers' }).click();
      cy.wait('@customersRequest');
      cy.testid('row-customer').should((customerRows) => {
        expect(customerRows.length).to.eq(customersCount);
      });
    });

    it('should test the API', () => {
      let id = 0;
      const anika: Partial<Customer> = {
        firstname: 'Anika',
        name: `Luhmann-${new Date().toISOString()}`,
        country: 'DE',
        birthdate: '1999-03-25T23:00:00.000Z',
      };
      cy.request(
        'POST',
        'https://api.eternal-holidays.net/customers',
        anika,
      ).then(({ body }) => {
        id = body.id;

        cy.request('https://api.eternal-holidays.net/customers').should(
          (response) => {
            const customers: Customer[] = response.body.content;
            const customer = customers.find((customer) => customer.id === id);
            expect(customer?.firstname).to.eq(anika.firstname);
            expect(customer?.name).to.eq(anika.name);
          },
        );

        cy.request('PUT', 'https://api.eternal-holidays.net/customers', {
          ...anika,
          id,
          country: 'UK',
        });

        cy.request('https://api.eternal-holidays.net/customers').should(
          (response) => {
            const customers: Customer[] = response.body.content;
            const customer = customers.find((customer) => customer.id === id);
            expect(customer?.country).to.eq('UK');
          },
        );

        cy.request(
          'DELETE',
          `https://api.eternal-holidays.net/customers/${id}`,
        );
        cy.request('https://api.eternal-holidays.net/customers').should(
          (response) => {
            const customers: Customer[] = response.body.content;
            const customer = customers.find((customer) => customer.id === id);
            expect(customer).to.be.undefined;
          },
        );
      });
    });
  });
});
