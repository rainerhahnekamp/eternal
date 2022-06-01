import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NewsletterComponent } from './newsletter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { HttpClient } from '@angular/common/http';
import { NewsletterService } from './newsletter.service';
import { By } from '@angular/platform-browser';
import { asyncScheduler, scheduled } from 'rxjs';

describe('Newsletter Component', () => {
  let fixture: ComponentFixture<NewsletterComponent>;
  let component: NewsletterComponent;
  const getButton = () =>
    fixture.debugElement.query(By.css('[data-testid=btn-subscribe]'))
      .nativeElement as HTMLButtonElement;
  const getInput = () =>
    fixture.debugElement.query(By.css('[data-testid=inp-email]')).nativeElement as HTMLInputElement;
  const getInputName = () =>
    fixture.debugElement.query(By.css('[data-testid=inp-name]')).nativeElement as HTMLInputElement;
  const getMessage = () =>
    fixture.debugElement.query(By.css('[data-testid=p-message]'))
      .nativeElement as HTMLParagraphElement;
  let newsletterServiceSpy: Spy<NewsletterService>;

  beforeEach(() => {
    newsletterServiceSpy = createSpyFromClass(NewsletterService);
    const httpClient = createSpyFromClass(HttpClient);
    fixture = TestBed.configureTestingModule({
      declarations: [NewsletterComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: NewsletterService, useValue: newsletterServiceSpy }]
    }).createComponent(NewsletterComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should instantiate', () => {
    expect(component).toBeInstanceOf(NewsletterComponent);
  });

  it('should test invalid submit', () => {
    component.handleSubmit();
    expect(component.message).toBe('Please provide an email');
  });

  it('should test invalid submit via DOM', fakeAsync(() => {
    const button = fixture.debugElement.query(By.css('[data-testid=btn-subscribe]'))
      .nativeElement as HTMLButtonElement;
    // fixture.autoDetectChanges(true);

    button.click();
    tick();
    fixture.detectChanges();
    const p = fixture.debugElement.query(By.css('[data-testid=p-message]'))
      .nativeElement as HTMLParagraphElement;
    expect(p.textContent).toBe('Please provide an email');
  }));

  it('should subscribe successfully via DOM', fakeAsync(() => {
    newsletterServiceSpy.send.mockReturnValue(scheduled([true], asyncScheduler));
    const input = getInput();
    input.value = 'user@host.com';
    input.dispatchEvent(new CustomEvent('input'));

    getButton().click();
    tick();
    fixture.detectChanges();
    expect(getMessage().textContent).toBe('Thank you for your subscription');
  }));
});
