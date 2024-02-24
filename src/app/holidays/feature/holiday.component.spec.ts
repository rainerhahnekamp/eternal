import { TestBed } from '@angular/core/testing';
import { HolidayComponent } from '@app/holidays/feature/holiday.component';
import { By } from '@angular/platform-browser';
import { createHoliday } from '@app/holidays/model';
import { Component } from '@angular/core';

@Component({
  template: ` <app-holiday [holiday]="holiday" />`,
  standalone: true,
  imports: [HolidayComponent],
})
class HolidayWrapperComponent {
  holiday = createHoliday({ title: 'London' });
}

it('should show username and holiday', () => {
  const fixture = TestBed.configureTestingModule({
    imports: [HolidayWrapperComponent],
  }).createComponent(HolidayWrapperComponent);

  const { componentInstance } = fixture;
  fixture.detectChanges();

  const body: HTMLParagraphElement = fixture.debugElement.query(
    By.css('[data-testid=txt-body]'),
  ).nativeElement;

  expect(body.textContent).toContain('Are you interested in visiting London?');

  componentInstance.holiday = createHoliday({ title: 'Vienna' });
  fixture.detectChanges();

  expect(body.textContent).toContain('Are you interested in visiting Vienna?');
});
