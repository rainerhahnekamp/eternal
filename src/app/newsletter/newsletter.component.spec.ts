import {
  ComponentFixtureAutoDetect,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  AppSubComponent,
  NewsletterComponent,
} from '@app/newsletter/newsletter.component';
import { expect } from '@jest/globals';
import { By } from '@angular/platform-browser';
import { createMock } from '@testing-library/angular/jest-utils';
import { HttpClient } from '@angular/common/http';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('Newsletter', () => {
  const setup = () => {
    const httpClient = createMock(HttpClient);
    const fixture = TestBed.configureTestingModule({
      declarations: [NewsletterComponent],
      imports: [MockComponent(AppSubComponent)],

      providers: [
        { provide: HttpClient, useValue: httpClient },
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    }).createComponent(NewsletterComponent);
    return { fixture, httpClient };
  };

  it('should instantiate', () => {
    const { fixture } = setup();
    expect(fixture.componentInstance).toBeInstanceOf(NewsletterComponent);
  });

  it('should submit without email', waitForAsync(() => {
    const { fixture } = setup();
    const button = fixture.debugElement.query(
      By.css('[data-testid=btn-subscribe]'),
    ).nativeElement as HTMLButtonElement;
    button.click();
    // fixture.componentInstance.handleSubmit();
    // fixture.detectChanges();
    const message = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement as HTMLParagraphElement;

    expect(message.textContent).toBe('Please provide an email');
  }));

  it('should submit with email', fakeAsync(() => {
    const { fixture, httpClient } = setup();
    httpClient.post.mockReturnValue(of(true).pipe(delay(0)));

    const input = fixture.debugElement.query(By.css('[data-testid=inp-email]'))
      .nativeElement as HTMLInputElement;
    input.value = 'user@host.com';
    input.dispatchEvent(new Event('input'));

    const button = fixture.debugElement.query(
      By.css('[data-testid=btn-subscribe]'),
    ).nativeElement as HTMLButtonElement;
    button.click();

    const loading = fixture.debugElement.query(
      By.css('[data-testid=p-loading]'),
    ).nativeElement as HTMLParagraphElement;
    expect(loading.textContent).toBe('Es lädt...');
    tick();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[data-testid=p-loading]'))).toBe(
      null,
    );
    const message = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement as HTMLParagraphElement;

    expect(message.textContent).toBe('Thank you for your subscription');
  }));
});
