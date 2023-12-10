import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonPipe, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-form-errors',
  template: ` @if (control) {
    @if (control.hasError('required')) {
      <span>This field is mandatory</span>
    }
  }`,
  standalone: true,
  imports: [NgIf, JsonPipe, MatInputModule],
})
export class FormErrorsComponent {
  @Input() control: AbstractControl | undefined;
}
