import { mount } from 'cypress/angular';
import { NewsletterComponent } from '@app/newsletter/newsletter.component';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { NewsletterService } from '@app/newsletter/newsletter.service';

const setup = () => {
  mount(NewsletterComponent, {
    providers: [provideHttpClient()],
  });
};

describe('Newsletter', () => {
  it('should not subscribe', () => {
    setup();
    cy.get('[data-testid=btn-subscribe]').click();
    cy.get('[data-testid=p-message]').should(
      'contain.text',
      'Please provide an email',
    );
  });

  it('should subscribe', () => {
    setup();
    cy.intercept('http://some.host.com/newsletter/subscribe', { body: true });
    cy.get('[data-testid=inp-email]').type('user@host.com');
    cy.get('[data-testid=btn-subscribe]').click();
    cy.get('[data-testid=p-message]').should(
      'contain.text',
      'Thank you for your subscription',
    ).and(() => {
      const service = TestBed.inject(NewsletterService)
      expect(service.email).to.be.eq('user@host.com')
    })
  });
});
