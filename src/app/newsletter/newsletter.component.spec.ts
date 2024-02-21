import {
  ComponentFixtureAutoDetect,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { NewsletterService } from '@app/newsletter/newsletter.service';
import {
  NewsletterComponent,
  SubComponent,
} from '@app/newsletter/newsletter.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { createMock } from '@testing-library/angular/jest-utils';
import { HttpClient } from '@angular/common/http';
import { asyncScheduler, scheduled } from 'rxjs';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockComponent, MockComponents } from 'ng-mocks';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

describe('Newsletter', () => {
  const setup = () => {
    const httpClient = createMock(HttpClient);
    const fixture = TestBed.configureTestingModule({
      imports: [NewsletterComponent, MockComponent(SubComponent)],
      providers: [
        provideRouter([
          {
            path: 'newsletter/:email',
            component: NewsletterComponent,
          },
        ]),
        provideNoopAnimations(),
        { provide: HttpClient, useValue: httpClient },
      ],
    }).createComponent(NewsletterComponent);
    fixture.detectChanges();

    return { fixture, httpClient };
  };

  it('should not subscribe', waitForAsync(() => {
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

  it('should subscribe', fakeAsync(() => {
    const { httpClient, fixture } = setup();
    httpClient.post.mockReturnValue(scheduled([true], asyncScheduler));
    const newsletterSerivce = TestBed.inject(NewsletterService);
    const sendSpy = jest.spyOn(newsletterSerivce, 'send');

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-testid=inp-email]'),
    ).nativeElement;
    input.value = 'user@host.com';
    input.dispatchEvent(new Event('input'));

    const button: HTMLButtonElement = fixture.debugElement.query(
      By.css('[data-testid=btn-subscribe]'),
    ).nativeElement;
    button.click();

    tick();
    fixture.detectChanges();
    const message: HTMLParagraphElement = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement;
    expect(message.textContent).toBe('Thank you for your subscription');
    expect(sendSpy).toHaveBeenCalledWith('user@host.com');
  }));

  // it('should subscribe', async () => {
  //   setup();
  //   const harness = await RouterTestingHarness.create('/newsletter/maria');
  //   const input: HTMLInputElement = harness.fixture.debugElement.query(
  //     By.css('[data-testid=inp-email]'),
  //   ).nativeElement;
  //
  //   expect(input.value).toBe('maria');
  // });
});
