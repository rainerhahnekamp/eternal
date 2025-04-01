import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-form-errors',
  template: ` @let control = this.control();

    @if (control.hasError('required')) {
      <span>This field is mandatory</span>
    }`,
  imports: [MatInputModule],
})
export class FormErrorsComponent {
  control = input.required<AbstractControl>();
}
