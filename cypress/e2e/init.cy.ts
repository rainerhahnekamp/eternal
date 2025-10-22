import { sidemenu } from '../page-objects/sidemenu';
import { testid } from '../page-objects/testid';

describe('init', () => {
  it('rename Latitia to Laetitia', () => {
    let a = 0;
    cy.visit('');

    cy.findByTestId('btn-customers').click();
    // cy.testid.ts('btn-customers').click();

    cy.get('[data-testid=row-customer]')
      .find('[data-testid.ts=name]')
      .should(($nameCells) => {
        expect($nameCells).to.have.length(10);
        const names = $nameCells
          .map((ix, nameCell) => nameCell.textContent)
          .toArray()
          .map((name) => name.trim())
          .filter((name) => name.startsWith('Latitia'));

        expect(names).to.have.length(1);
        a = $nameCells.length;
      });

    cy.get('a').contains('Customers').click();
    cy.contains('[data-testid.ts=row-customer]', 'Latitia')
      .find('[data-testid.ts=btn-edit]')
      .click();
    cy.get('[data-testid=inp-firstname]').clear();
    cy.get('[data-testid=inp-firstname]').type('Laetitia');
    cy.get('[data-testid=btn-submit]').click();

    cy.contains('[data-testid.ts=row-customer]', 'Laetitia');
    cy.get('[data-testid=row-customer]')
      .contains('Laetitia')
      .should('be.visible');
    cy.get('[data-testid=row-customer]').should('contain.text', 'Laetitia'); // Implicit Assertion

    cy.wrap(a).should(() => {
      console.log('a: ', a);
      if (!a) {
        throw new Error('A has not been set');
      }
    });
  });

  it('should click the button', () => {
    cy.visit('');
    cy.findByRole('button', { name: 'Click Me' }).click();
    cy.findByRole('button', { name: 'Unclick Me' }).should('be.visible');
  });

  describe('network tests', () => {
    it('does something with the network (approach 1)', () => {
      let holidaysCount = 0;
      cy.visit('');
      cy.intercept('https://api.eternal-holidays.net/holiday', (req) => {
        req.continue((response) => {
          holidaysCount = response.body.length;
          response.send();
        });
      }).as('holidaysRequest');

      cy.openSidemenu('Holidays');

      cy.wait('@holidaysRequest').then(() => {
        cy.get('app-holiday-card').should('have.length', holidaysCount);
      });
    });

    it('does something with the network (approach 2)', () => {
      let holidaysCount = 0;
      cy.visit('');
      cy.intercept('https://api.eternal-holidays.net/holiday', (req) => {
        req.continue((response) => {
          holidaysCount = response.body.length;
          response.send();
        });
      }).as('holidaysRequest');
      sidemenu.open('Holidays');

      cy.wait('@holidaysRequest');
      cy.get('app-holiday-card').should(($cards) => {
        expect($cards).to.have.length(holidaysCount);
      });
    });

    it('does something with the network (approach 3)', () => {
      let holidaysCount: undefined | number = undefined;
      cy.visit('');
      cy.intercept('https://api.eternal-holidays.net/holiday', (req) => {
        req.continue((response) => {
          holidaysCount = response.body.length;
          response.send();
        });
      }).as('holidaysRequest');
      cy.findByRole('link', { name: 'Holidays' }).click();

      cy.get('app-holiday-card').should(($cards) => {
        expect(holidaysCount).not.to.eq(undefined);
        expect($cards).to.have.length(Number(holidaysCount));
      });
    });

    it('does something with the network (approach 4)', () => {
      cy.visit('');

      cy.request('https://api.eternal-holidays.net/holiday').then(
        (response) => {
          const holidaysCount = response.body.length;
          cy.task('log', response.body).then(console.log);
          cy.findByRole('link', { name: 'Holidays' }).click();
          cy.get('app-holiday-card').should('have.length', holidaysCount);
        },
      );
    });
  });

  it('should verify 2 is shown in number list', () => {
    cy.visit('');
    testid('number').find('span').should('contain.text', '2');
  });
});
