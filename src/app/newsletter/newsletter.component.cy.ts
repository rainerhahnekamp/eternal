import { mount } from 'cypress/angular';
import { NewsletterComponent } from '@app/newsletter/newsletter.component';
import { MockComponent } from 'ng-mocks';
import { SubComponent } from '@app/newsletter/sub.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

for (const email of ['user@host.com', 'user1@host.com', 'user2@host.com',  'user3@host.com', 'user4@host.com']) {
  it(`should subscribe for ${email}`, () => {
    cy.intercept('http://some.host.com/newsletter/subscribe', { body: true });

    mount(NewsletterComponent, {
      imports: [MockComponent(SubComponent)],
      providers: [provideHttpClient(), provideNoopAnimations()],
    });

    cy.get('[data-testid=inp-email]').type(email);
    cy.get('[data-testid=btn-subscribe]').click();
    cy.get('[data-testid=p-message]').should(
      'contain.text',
      'Thank you for your subscription',
    );
  });
}
