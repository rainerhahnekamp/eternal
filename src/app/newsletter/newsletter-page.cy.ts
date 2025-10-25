import NewsletterPage from './newsletter-page';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe(NewsletterPage.name, () => {
  it('should report errors', () => {
    cy.intercept('http://some.host.com/newsletter/subscribe', { body: true });
    cy.mount(NewsletterPage, {
      providers: [provideHttpClient(), provideRouter([])],
    });
    cy.findByRole('textbox', { name: 'Address' }).type('Domgasse 5');
    cy.findByRole('button', { name: 'Subscribe' }).click();
    cy.findByRole('status').should(
      'contain.text',
      'Thank you for your subscription',
    );
  });
});
