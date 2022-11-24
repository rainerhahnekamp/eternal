import { FieldType } from '@ngx-formly/material';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-file',
  template: `
    <input type="file" [formControl]="formControl" [formlyAttributes]="field" />
  `,
  standalone: true,
  imports: [ReactiveFormsModule, FormlyModule],
})
export class FileField extends FieldType<any> {}
