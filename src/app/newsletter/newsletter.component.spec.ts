import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NewsletterComponent } from '@app/newsletter/newsletter.component';
import { expect } from '@jest/globals';
import { By } from '@angular/platform-browser';
import { createMock } from '@testing-library/angular/jest-utils';
import { HttpClient } from '@angular/common/http';
import { asyncScheduler, scheduled } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('Newsletter Component', () => {
  const setup = () => {
    const httpClient = createMock(HttpClient);

    const fixture = TestBed.configureTestingModule({
      imports: [NewsletterComponent],
      providers: [
        provideRouter([]),
        { provide: HttpClient, useValue: httpClient },
        // { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    }).createComponent(NewsletterComponent);
    fixture.detectChanges();

    return { fixture, httpClient };
  };

  it('should instantiate', () => {
    expect(setup()).toBeDefined();
  });

  it('should not subscribe', () => {
    const { fixture } = setup();

    const button = fixture.debugElement.query(
      By.css('[data-testid=btn-subscribe]'),
    ).nativeElement as HTMLButtonElement;
    button.click();

    const message = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement as HTMLParagraphElement;
    fixture.detectChanges();
    expect(message.textContent).toBe('Please provide an email');
  });

  it('should subscribe', fakeAsync(() => {
    const { fixture, httpClient } = setup();
    httpClient.post.mockReturnValue(scheduled([true], asyncScheduler));

    const input = fixture.debugElement.query(By.css('[data-testid=inp-email]'))
      .nativeElement as HTMLInputElement;
    input.value = 'user@host.com';
    input.dispatchEvent(new CustomEvent('input'));

    const button = fixture.debugElement.query(
      By.css('[data-testid=btn-subscribe]'),
    ).nativeElement as HTMLButtonElement;
    button.click();
    tick();
    fixture.detectChanges();

    const message = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement as HTMLParagraphElement;
    expect(message.textContent).toBe('Thank you for your subscription');
  }));
});
