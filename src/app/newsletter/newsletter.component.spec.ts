import { TestBed } from '@angular/core/testing';
import NewsletterComponent from './newsletter.component';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { Component } from '@angular/core';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { userEvent } from '@testing-library/user-event';
import { screen } from '@testing-library/angular';

@Component({
  selector: 'app-home-link',
  template: ``,
})
export class MockHomeLinkComponent {}

@Component({
  template: ``,
})
class MockedHomeComponent {}

describe('Newsletter Component', () => {
  const setup = async () => {
    const guardMock = { confirmed: jest.fn() };
    TestBed.configureTestingModule({
      imports: [NewsletterComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: '', component: MockedHomeComponent },
          {
            canDeactivate: [() => guardMock.confirmed()],
            path: 'newsletter',
            component: NewsletterComponent,
          },
        ]),
        provideLocationMocks(),
      ],
    });

    const { fixture } = await RouterTestingHarness.create('/newsletter');
    fixture.autoDetectChanges();

    const user = userEvent.setup();
    const ctrl = TestBed.inject(HttpTestingController);

    return { fixture, ctrl, guardMock, user };
  };

  it('should instantiate', async () => {
    const { fixture } = await setup();
    expect(fixture.componentInstance).toBeDefined();
  });

  it('should use the deactive guard', async () => {
    const { fixture, guardMock } = await setup();
    const homeLink: HTMLLinkElement = fixture.debugElement.query(
      By.css('[data-testid=lnk-home'),
    ).nativeElement;
    homeLink.click();
    expect(guardMock.confirmed).toHaveBeenCalled();
  });

  it('should not subscribe', async () => {
    const { fixture } = await setup();
    const button: HTMLButtonElement = fixture.debugElement.query(
      By.css('[data-testid=btn-subscribe]'),
    ).nativeElement;
    button.click();

    await fixture.whenStable();

    const message: HTMLParagraphElement = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement;
    expect(message.textContent).toBe('Please provide an email');
  });

  it('should subscribe', async () => {
    const { fixture, ctrl, user } = await setup();

    await user.type(
      screen.getByRole('textbox', {
        name: /address/i,
      }),
      'user@host.com',
    );

    await user.click(
      screen.getByRole('button', {
        name: /subscribe/i,
      }),
    );

    ctrl.expectOne('http://some.host.com/newsletter/subscribe').flush(true);

    await fixture.whenStable();
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('Thank you for your subscription');
  });
});
