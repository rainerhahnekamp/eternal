import { mount } from 'cypress/angular';
import {
  NewsletterComponent,
  SubNewsletterComponent,
} from '@app/newsletter/newsletter.component';
import { MockComponents } from 'ng-mocks';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { By } from "@angular/platform-browser";

it('should subscribe', () => {
  mount(NewsletterComponent, {
    imports: [MockComponents(SubNewsletterComponent)],
    providers: [provideAnimations(), provideHttpClient()],
  }).then((mountResponse) => {

    const subNewsletterComponent = mountResponse.fixture.debugElement.query(By.directive(SubNewsletterComponent));
    cy.intercept('http://some.host.com/newsletter/subscribe', { body: true });
    cy.get('[data-testid=inp-email]').type('user@host.com');
    cy.get('[data-testid=btn-subscribe]').click();
    cy.get('[data-testid=p-message]').should(
      'contain.text',
      'Thank you for your subscription',
    ).and(() => {
      expect((subNewsletterComponent.componentInstance as SubNewsletterComponent).email).to.eq("user@host.com")
    })

  });
});
