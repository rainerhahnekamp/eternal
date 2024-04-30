import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import {
  NewsletterComponent,
  SubNewsletterComponent,
} from '@app/newsletter/newsletter.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { fi } from 'date-fns/locale';
import { By } from '@angular/platform-browser';
import { createMock } from '@testing-library/angular/jest-utils';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Component } from '@angular/core';
import { MockComponent } from 'ng-mocks';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

it('should consume email from route', waitForAsync(async () => {
  const httpClient = createMock(HttpClient);
  TestBed.configureTestingModule({
    imports: [NewsletterComponent, MockComponent(SubNewsletterComponent)],
    providers: [
      provideNoopAnimations(),
      provideRouter(
        [
          {
            path: 'newsletter/:email',
            component: NewsletterComponent,
          },
        ],
        withComponentInputBinding(),
      ),
      { provide: HttpClient, useValue: httpClient },
    ],
  });
  const harness = await RouterTestingHarness.create('/newsletter/hugo');
  const input: HTMLInputElement = harness.fixture.debugElement.query(
    By.css('[data-testid=inp-email]'),
  ).nativeElement;

  expect(input.value).toBe('hugo');
}));

describe('Newsletter Component', () => {
  const setup = () => {
    const httpClient = createMock(HttpClient);
    const fixture = TestBed.configureTestingModule({
      imports: [NewsletterComponent, MockComponent(SubNewsletterComponent)],
      providers: [
        provideNoopAnimations(),
        { provide: HttpClient, useValue: httpClient },
      ],
    }).createComponent(NewsletterComponent);
    fixture.detectChanges();

    return { fixture, httpClient };
  };

  it('should initialize', waitForAsync(() => {
    const { fixture } = setup();
    expect(fixture.componentInstance).toBeInstanceOf(NewsletterComponent);
    fixture.componentRef.setInput('email', 'user');
  }));

  it('should not provide an email', waitForAsync(async () => {
    const { fixture } = setup();
    const button: HTMLButtonElement = fixture.debugElement.query(
      By.css('[data-testid=btn-subscribe]'),
    ).nativeElement;

    button.click();
    fixture.detectChanges();
    const message: HTMLParagraphElement = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement;

    expect(message.textContent).toBe('Please provide an email');
  }));

  it('should provide an email', waitForAsync(async () => {
    const { fixture, httpClient } = setup();

    httpClient.post.mockReturnValue(of(true).pipe(delay(0)));
    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-testid=inp-email]'),
    ).nativeElement;
    const button: HTMLButtonElement = fixture.debugElement.query(
      By.css('[data-testid=btn-subscribe]'),
    ).nativeElement;

    input.value = 'user@host.com';
    input.dispatchEvent(new Event('input'));

    button.click();
    const message: HTMLParagraphElement = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement;

    await fixture.whenStable();
    fixture.detectChanges();
    expect(message.textContent).toBe('Thank you for your subscription');
  }));
});
