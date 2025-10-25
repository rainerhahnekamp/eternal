import { it, describe, expect } from 'vitest';
import NewsletterPage from './newsletter-page';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

@Component({
  selector: 'app-home-link',
  template: ``,
})
class MockedHomeLink {}

describe(NewsletterPage.name, () => {
  const setup = () => {
    // TestBed.overrideComponent(NewsletterPage, {
    //   remove: { imports: [HomeLink] },
    //   add: { imports: [MockedHomeLink] },
    // });
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideLocationMocks(),
      ],
    }).createComponent(NewsletterPage);
    fixture.detectChanges();

    const ctrl = TestBed.inject(HttpTestingController);

    return { fixture, ctrl };
  };
  it('should instantiate', () => {
    const { fixture } = setup();
    expect(fixture).toBeTruthy();
  });

  it('should do property binding for title', async () => {
    const { fixture } = setup();
    fixture.componentRef.setInput('title', 'Newsletter');
    await fixture.whenStable();

    const title = fixture.debugElement.query(By.css('h2'))
      .nativeElement as HTMLHeadElement;
    expect(title.textContent).toContain('Newsletter');

    return fixture;
  });

  it('should show an error message if field is empty', async () => {
    const { fixture } = setup();

    const submitBtn: HTMLButtonElement = fixture.debugElement.query(
      By.css('[data-testid=btn-subscribe]'),
    ).nativeElement;
    submitBtn.click();

    await fixture.whenStable();

    const pMessage = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement as HTMLParagraphElement;
    expect(pMessage.textContent).toBe('Please provide an email');
  });

  it('should show a success message', async () => {
    const { fixture, ctrl } = setup();

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-testid=inp-email]'),
    ).nativeElement;
    const submitBtn: HTMLButtonElement = fixture.debugElement.query(
      By.css('[data-testid=btn-subscribe]'),
    ).nativeElement;

    input.value = 'user@host.com';
    input.dispatchEvent(new CustomEvent('input'));
    submitBtn.click();

    ctrl.expectOne('http://some.host.com/newsletter/subscribe').flush(true);

    await fixture.whenStable();

    const pMessage = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement as HTMLParagraphElement;
    expect(pMessage.textContent).toBe('Thank you for your subscription');
  });
});
