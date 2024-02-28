import {
  Component,
  EventEmitter,
  Input,
  input,
  model,
  Output,
} from '@angular/core';
import { Holiday } from '@app/holidays/model';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-holiday',
  template: `<p data-testid="txt-greeting">Hello {{ username() }}</p>
    <p data-testid="txt-body">
      Are you interested in visiting {{ holiday().title }}?
    </p>
    <p> Rate your Holiday </p>
    <button mat-raised-button data-testid="btn-up" (click)="rating.set('👍')"
      >👍</button
    >
    <button mat-raised-button data-testid="btn-down" (click)="rating.set('👎')"
      >👎</button
    >`,
  standalone: true,
  imports: [MatButton],
})
export class HolidayComponent {
  username = input('');
  holiday = input.required<Holiday>();

  rating = model.required<'👍' | '👎'>();
}
