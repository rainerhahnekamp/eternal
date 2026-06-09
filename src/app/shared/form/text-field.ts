import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import {
  MatInput,
  MatFormField,
  MatLabel,
  MatHint,
  MatError,
} from '@angular/material/input';

@Component({
  selector: 'app-text-field',
  template: `
    @let fieldTree = this.fieldTree();

    <mat-form-field>
      <mat-label>{{ label() }}</mat-label>
      <input [formField]="fieldTree" matInput />
      <mat-hint>{{ placeholder() }}</mat-hint>

      @for (error of fieldTree().errors(); track error.message) {
        <mat-error>{{ error.message }}</mat-error>
      }
    </mat-form-field>
  `,
  imports: [MatInput, MatFormField, MatLabel, FormField, MatHint, MatError],
})
export class TextFieldComponent {
  label = input.required<string>();
  fieldTree = input.required<FieldTree<string>>();
  placeholder = input.required<string>();
}
