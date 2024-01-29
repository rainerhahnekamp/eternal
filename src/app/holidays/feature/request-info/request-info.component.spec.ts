import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RequestInfoComponent } from '@app/holidays/feature/request-info/request-info.component';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { delay } from 'rxjs/operators';
import { Component } from '@angular/core';
import { RequestInfoComponentHolidayCard } from '@app/holidays/feature/request-info/request-info-holiday-card.component';

@Component({
  selector: 'app-request-info-holiday-card',
  template: ``,
  standalone: true,
})
class MockedRequestInfoHolidayCard {}

it('should verify that address does exist', fakeAsync(() => {
  TestBed.overrideComponent(RequestInfoComponent, {
    remove: { imports: [RequestInfoComponentHolidayCard] },
    add: { imports: [MockedRequestInfoHolidayCard] },
  });
  const fixture = TestBed.configureTestingModule({
    imports: [RequestInfoComponent],
    providers: [
      provideNoopAnimations(),
      {
        provide: HttpClient,
        useValue: {
          get: (url: string) => of([true]).pipe(delay(125)),
        },
      },
    ],
  }).createComponent(RequestInfoComponent);
  fixture.detectChanges();

  const input: HTMLInputElement = fixture.debugElement.query(
    By.css('[data-testid=inp-address]'),
  ).nativeElement;

  input.value = 'Domgasse 5';
  input.dispatchEvent(new Event('input'));

  fixture.debugElement
    .query(By.css('[data-testid=btn-search]'))
    .nativeElement.click();

  tick(125);
  fixture.detectChanges();

  const message: HTMLParagraphElement = fixture.debugElement.query(
    By.css('[data-testid=txt-message]'),
  ).nativeElement;
  expect(message.textContent?.trim()).toBe('Brochure sent');
}));
