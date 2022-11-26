import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { Options } from '@eternal/shared/form';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { formly } from 'ngx-formly-helpers';
import { Holiday } from '@eternal/admin/holidays/model';
import { NgIf } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'eternal-holiday-detail',
  templateUrl: 'holiday-detail.component.html',
  standalone: true,
  imports: [
    FormlyModule,
    NgIf,
    ReactiveFormsModule,
    RouterLinkWithHref,
    MatButtonModule,
  ],
})
export class HolidayDetailComponent {
  formGroup = new UntypedFormGroup({});

  @Input() holiday: Holiday | undefined;
  @Input() guides: Options = [];

  @Output() save = new EventEmitter<Holiday>();
  @Output() remove = new EventEmitter<Holiday>();
  fields: FormlyFieldConfig[] = [];

  ngOnInit() {
    this.fields = [
      formly.requiredText('name', 'Name', {
        attributes: { 'data-testid': 'inp-name' },
      }),
      formly.textArea('description', 'Description', {
        attributes: { 'data-testid': 'inp-description', rows: 10 },
      }),
    ];
  }

  submit() {
    if (this.formGroup.valid) {
      this.save.emit(this.formGroup.value);
    }
  }

  handleRemove() {
    if (this.holiday && confirm(`Really delete ${this.holiday.name}?`)) {
      this.remove.emit(this.holiday);
    }
  }
}
