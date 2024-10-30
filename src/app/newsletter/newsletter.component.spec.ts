import { ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { NewsletterComponent } from './newsletter.component';
import { expect } from '@jest/globals';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { RouterTestingHarness } from '@angular/router/testing';

describe('Newsletter', () => {
  const setup = async () => {
    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(
          [
            {
              path: 'newsletter/:email',
              component: NewsletterComponent,
            },
          ],
          withComponentInputBinding(),
        ),
        provideLocationMocks(),
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    });

    const harness = await RouterTestingHarness.create('/newsletter/hugo');
    const ctrl = TestBed.inject(HttpTestingController);

    return { fixture: harness.fixture, ctrl, harness };
  };

  it('should initialize', async () => {
    const { fixture } = await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should fail on missing email', async () => {
    const { fixture } = await setup();
    fixture.autoDetectChanges(true);

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-testid=inp-email]'),
    ).nativeElement;
    input.value = '';
    input.dispatchEvent(new Event('input'));

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
    const { harness, ctrl, fixture } = await setup();

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-testid=inp-email]'),
    ).nativeElement;
    input.value = 'user@host.com';
    input.dispatchEvent(new Event('input'));

    const button: HTMLButtonElement = fixture.debugElement.query(
      By.css('[data-testid=btn-subscribe]'),
    ).nativeElement;
    button.click();
    ctrl.expectOne('http://some.host.com/newsletter/subscribe').flush(true);

    await fixture.whenStable();

    const message: HTMLParagraphElement = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement;

    expect(message.textContent).toBe('Thank you for your subscription');
    ctrl.verify();
  });

  it('should contain a value', async () => {
    const { fixture } = await setup();

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-testid=inp-email]'),
    ).nativeElement;

    expect(input.value).toBe('hugo');
  });
});
