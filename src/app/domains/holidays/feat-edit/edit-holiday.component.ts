import {
  ChangeDetectionStrategy,
  Component,
  input,
  numberAttribute,
} from '@angular/core';

@Component({
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class EditHolidayComponent {
  id = input.required({ transform: numberAttribute });
}
