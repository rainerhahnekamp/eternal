import { TestBed } from '@angular/core/testing';
import NewsletterComponent from './newsletter.component';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from "@angular/common/http";

import { Component } from "@angular/core";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideRouter } from "@angular/router";
import { provideLocationMocks } from "@angular/common/testing";
import { RouterTestingHarness } from "@angular/router/testing";

@Component({
  selector: 'app-home-link',
  template: ``,
})
export class MockHomeLinkComponent {}

describe('Newsletter Component', () => {
  const setup = async () => {

    TestBed.configureTestingModule({
      imports: [NewsletterComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([{
        path: 'newsletter',
        component: NewsletterComponent
      }]), provideLocationMocks()],
    })

    const {fixture} = await RouterTestingHarness.create('/newsletter')
    fixture.autoDetectChanges();

    const ctrl = TestBed.inject(HttpTestingController)

    return { fixture, ctrl };
  };

  it('should instantiate', async () => {
    const { fixture } = await setup();
    expect(fixture.componentInstance).toBeDefined()
  });

  it('should not subscribe', async () => {
    const { fixture } = await setup();
    const button: HTMLButtonElement = fixture.debugElement.query(
      By.css('[data-testid=btn-subscribe]'),
    ).nativeElement;
    button.click();

    await fixture.whenStable()

    const message: HTMLParagraphElement = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement;
    expect(message.textContent).toBe('Please provide an email');
  });

  it('should subscribe', async () => {
    const { fixture, ctrl } = await setup();

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-testid=inp-email]'),
    ).nativeElement;
    input.value = 'user@host.com';
    input.dispatchEvent(new Event('input'));

    const button: HTMLButtonElement = fixture.debugElement.query(
      By.css('[data-testid=btn-subscribe]'),
    ).nativeElement;
    button.click();
    ctrl.expectOne('http://some.host.com/newsletter/subscribe').flush(true)

    const message: HTMLParagraphElement = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement;

    await fixture.whenStable();
    expect(message.textContent).toBe('Thank you for your subscription');
  });
});
