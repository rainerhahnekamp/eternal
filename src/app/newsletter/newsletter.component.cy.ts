import {
  HomeLinkComponent,
  NewsletterComponent,
} from '@app/newsletter/newsletter.component';
import { MockComponent } from 'ng-mocks';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

it('should subscribe', () => {
  cy.mount(NewsletterComponent, {
    imports: [NewsletterComponent, MockComponent(HomeLinkComponent)],
    providers: [provideNoopAnimations(), provideHttpClient()],
  });

  cy.intercept('http://some.host.com/newsletter/subscribe', {body: true})

  cy.findByRole('textbox', {name: /email/i}).type('user@host.com')
  cy.findByRole('button', {name: 'Subscribe'}).click()

  cy.get('[data-testid="p-message"]').should('contain.text', 'Thank you for your subscription')
});
