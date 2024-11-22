import { NewsletterComponent } from './newsletter.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

it('should subscribe', () => {
  cy.mount(NewsletterComponent, {
    imports: [NewsletterComponent],
    providers: [
      provideNoopAnimations(),
      provideHttpClient(),
      provideRouter([]),
    ],
  });

  cy.intercept('http://some.host.com/newsletter/subscribe', { body: true });
  cy.get('[data-testid=inp-email]').type('user@host.com');
  cy.get('[data-testid=btn-subscribe]').click();
  cy.get('[data-testid=p-message]').should(
    'contain.text',
    'Thank you for your subscription',
  );
});
