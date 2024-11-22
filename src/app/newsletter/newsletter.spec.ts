import { expect } from '@jest/globals';
import { ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { NewsletterComponent } from './newsletter.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { createMock } from '@testing-library/angular/jest-utils';
import { HttpClient } from '@angular/common/http';
import { asapScheduler, scheduled } from 'rxjs';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

describe('Newsletter', () => {
  const httpClient = createMock(HttpClient);
  const setup = async (runCd = true) => {
    TestBed.configureTestingModule({
      imports: [NewsletterComponent],
      providers: [
        provideNoopAnimations(),
        provideLocationMocks(),
        provideRouter([
          {
            path: 'newsletter',
            component: NewsletterComponent,
          },
        ]),
        { provide: HttpClient, useValue: httpClient },
        { provide: ComponentFixtureAutoDetect, useValue: runCd },
      ],
    });

    const harness = await RouterTestingHarness.create('newsletter');
    const fixture = harness.fixture;

    return { fixture, httpClient };
  };

  it('should fail if no email is present', async () => {
    const { fixture } = await setup();
    fixture.debugElement
      .query(By.css('[data-testid=btn-subscribe]'))
      .nativeElement.click();
    fixture.detectChanges();

    const p: HTMLParagraphElement = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement;

    expect(p.textContent).toContain('Please provide an email');
  });

  it('should work if the email is present', async () => {
    const { fixture, httpClient } = await setup();

    httpClient.post.mockReturnValue(scheduled([true], asapScheduler));

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-testid=inp-email]'),
    ).nativeElement;
    input.value = 'user@host.com';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    fixture.debugElement
      .query(By.css('[data-testid=btn-subscribe]'))
      .nativeElement.click();
    await fixture.whenStable();

    const p: HTMLParagraphElement = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement;
    const pCounter: HTMLParagraphElement = fixture.debugElement.query(
      By.css('[data-testid=p-counter]'),
    ).nativeElement;

    expect(p.textContent).toContain('Thank you for your subscription');
    expect(pCounter.textContent).toContain('successful subscriptions: 1');
  });
});
