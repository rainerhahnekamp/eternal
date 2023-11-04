import { NewsletterComponent } from '@app/newsletter/newsletter.component';
import { provideHttpClient } from '@angular/common/http';

describe('Newsletter', () => {
  it('should subscribe', () => {
    cy.intercept('http://some.host.com/newsletter/subscribe', {
      body: true,
      delay: 250,
    });
    cy.mount(NewsletterComponent, {
      providers: [provideHttpClient()],
    });
    cy.get('[data-testid="inp-email"]').type('user@host.com');
    cy.get('[data-testid=btn-subscribe]').click();

    cy.get('[data-testid=p-message]').should('not.exist');
    cy.get('[data-testid=p-loading]').should('be.visible');
    cy.get('[data-testid=p-message]').should(
      'have.text',
      'Thank you for your subscription',
    );
    cy.get('[data-testid=p-loading]').should('not.exist');
  });
});
