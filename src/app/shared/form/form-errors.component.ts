import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-form-errors',
  template: ` @if (control) {
    @if (control.hasError('required')) {
      <span>This field is mandatory</span>
    }
  }`,
  imports: [MatInputModule],
})
export class FormErrorsComponent {
  @Input() control: AbstractControl | undefined;
}
