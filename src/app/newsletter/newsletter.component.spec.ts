import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  NewsletterComponent,
  SubNewsletterComponent,
} from '@app/newsletter/newsletter.component';
import { expect } from '@jest/globals';
import {
  NoopAnimationsModule,
  provideNoopAnimations,
} from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { createMock, provideMock } from "@testing-library/angular/jest-utils";
import { HttpClient } from '@angular/common/http';
import { of, scheduled } from 'rxjs';
import { delay } from 'rxjs/operators';
import { NewsletterService } from '@app/newsletter/newsletter.service';
import { Component } from '@angular/core';
import { MockComponent, MockComponents } from "ng-mocks";

describe('Newsletter', () => {
  const httpClient = createMock(HttpClient);
  const newsletterService = createMock(NewsletterService);

  const setup = (runCd = true) => {
    const fixture = TestBed.configureTestingModule({
      imports: [NewsletterComponent, MockComponents(SubNewsletterComponent)],
      providers: [
        provideNoopAnimations(),
        { provide: NewsletterService, useValue: newsletterService },
      ],
    }).createComponent(NewsletterComponent);
    if (runCd) {
      fixture.detectChanges();
    }
    return { fixture, newsletterService, httpClient };
  };

  it('should instantiate', waitForAsync(() => {
    const { fixture } = setup();
    expect(fixture.componentInstance).toBeInstanceOf(NewsletterComponent);
  }));

  it('should not subscribe', waitForAsync(() => {
    const { fixture } = setup();
    // const button = document.querySelector('button[data-testid=btn-subscribe]')
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

  it('should subscribe', waitForAsync(async () => {
    const { fixture, newsletterService } = setup();
    newsletterService.send.mockReturnValue(of(true).pipe(delay(0)));

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-testid=inp-email]'),
    ).nativeElement;
    input.value = 'user@host.com';
    input.dispatchEvent(new Event('input'));

    const button: HTMLButtonElement = fixture.debugElement.query(
      By.css('[data-testid=btn-subscribe]'),
    ).nativeElement;

    button.click();
    await fixture.whenStable();
    fixture.detectChanges();

    const message: HTMLParagraphElement = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement;

    expect(message.textContent).toBe('Thank you for your subscription');
  }));
});
