import { Component, effect, input } from '@angular/core';
import { Holiday } from '@app/holidays/model';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-holiday',
  template: `<p data-testid="txt-greeting">Hello {{ username() }}</p>
    <p data-testid="txt-body">
      Are you interested in visiting {{ holiday().title }}?
    </p>
    <button mat-raised-button>Yes</button>`,
  standalone: true,
  imports: [MatButton],
})
export class HolidayComponent {
  username = input('');
  holiday = input.required<Holiday>();

  constructor() {
    effect(() => {
      console.log(this.holiday().title);
    });
  }
}
