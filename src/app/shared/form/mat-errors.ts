import { Component, input } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-errors',
  template: `
    @for (error of control()().errors; track error.message) {
      <mat-error>{{ error.message }}</mat-error>
    }
  `,
  imports: [MatError],
})
export class FormErrors {
  public readonly control = input.required<{ errors: ValidationError[] }>;
}
