import { fakeAsync, TestBed } from '@angular/core/testing';
import { NewsletterComponent } from '@app/newsletter/newsletter.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createMock } from '@testing-library/angular/jest-utils';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('Newsletter', () => {
  const setup = async () => {
    // createMock: testing-library only for Jest
    // createSpyFromClass: jasmine-auto-spies for Jasmine
    const httpClient = createMock(HttpClient);

    const fixture = TestBed.configureTestingModule({
      imports: [
        NewsletterComponent,
        NoopAnimationsModule,
        RouterModule.forRoot([
          { path: 'newsletter', component: NewsletterComponent },
        ]),
        HttpClientTestingModule,
      ],
      providers: [
        // { provide: ComponentFixtureAutoDetect, useValue: true }
      ],
    }).createComponent(NewsletterComponent);
    fixture.detectChanges();
    return { fixture, httpClient };
  };

  it('should instantiate', () => {
    const { fixture } = setup();
    expect(fixture.componentInstance).toBeInstanceOf(NewsletterComponent);
  });

  it('should show an error message if email is missing', () => {
    const { fixture } = setup();

    const button = fixture.debugElement.query(
      By.css('[data-testid=btn-subscribe]'),
    ).nativeElement as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    const message = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement as HTMLParagraphElement;

    expect(message.textContent).toBe('Please provide an email');
  });

  it('should show a confirmation', fakeAsync(() => {
    const { fixture, httpClient } = setup();
    httpClient.post.mockReturnValue(of(true).pipe(delay(1000)));

    const email = fixture.debugElement.query(By.css('[data-testid=inp-email]'))
      .nativeElement as HTMLInputElement;
    email.value = 'user@host.com';
    email.dispatchEvent(new Event('input')); // DOM Events

    const button = fixture.debugElement.query(
      By.css('[data-testid=btn-subscribe]'),
    ).nativeElement as HTMLButtonElement;
    button.click();

    TestBed.inject(HttpTestingController)
      .expectOne('http://some.host.com/newsletter/subscribe')
      .flush(true);
    fixture.detectChanges();

    const message = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement as HTMLParagraphElement;

    expect(message.textContent).toBe('Thank you for your subscription');
  }));
});
