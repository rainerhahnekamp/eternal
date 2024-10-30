import { NewsletterComponent } from './newsletter.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter } from '@angular/router';

it('should handle email', () => {
  cy.mount(NewsletterComponent, {
    componentProperties: {
      email: signal(''),
    },
    providers: [
      provideAnimations(),
      provideHttpClient(),
      provideLocationMocks(),
      provideRouter([]),
    ],
  });

  cy.intercept('http://some.host.com/newsletter/subscribe', { body: true });

  cy.findByRole('textbox', { name: 'Address' }).type('hans@gruber.com');
  cy.findByRole('button', { name: 'Subscribe' }).click();
  cy.findByRole('paragraph').should(
    'contain.text',
    'Thank you for your subscription',
  );
});
