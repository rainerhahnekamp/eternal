import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonPipe, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-form-errors',
  template: ` <ng-container *ngIf="control">
    <span *ngIf="control.hasError('required')">This field is mandatory</span>
  </ng-container>`,
  standalone: true,
  imports: [NgIf, JsonPipe, MatInputModule],
})
export class FormErrorsComponent {
  @Input() control: AbstractControl | undefined;
}
