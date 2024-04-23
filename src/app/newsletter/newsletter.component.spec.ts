import { TestBed, waitForAsync } from '@angular/core/testing';
import { NewsletterComponent } from '@app/newsletter/newsletter.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { expect } from '@jest/globals';
import { createMock } from '@testing-library/angular/jest-utils';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Component } from '@angular/core';
import { SubComponent } from '@app/newsletter/sub.component';
import { MockComponent } from "ng-mocks";

// @Component({
//   selector: 'app-sub-newsletter',
//   template: ``,
//   standalone: true,
// })
// export class MockedSubNewsletterComponent {}

describe('Newsletter', () => {
  const setup = (runChangeDetection = true) => {
    // TestBed.overrideComponent(NewsletterComponent, {
    //   remove: { imports: [SubComponent] },
    //   add: { imports: [MockedSubNewsletterComponent] },
    // });
    const httpClientMock = createMock(HttpClient);
    const fixture = TestBed.configureTestingModule({
      // template dependencies
      imports: [NewsletterComponent, MockComponent(SubComponent)],

      // service dependencies
      providers: [
        provideNoopAnimations(),
        { provide: HttpClient, useValue: httpClientMock },
      ],
    }).createComponent(NewsletterComponent);

    if (runChangeDetection) {
      fixture.detectChanges();
    }

    return { fixture, httpClientMock };
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

  it('should subscribe', waitForAsync(async () => {
    const { fixture, httpClientMock } = setup();
    httpClientMock.post.mockReturnValue(of(true).pipe(delay(0)));

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
