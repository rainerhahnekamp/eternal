import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { formly } from 'ngx-formly-helpers';

@Component({
  selector: 'app-sign-up-terms',
  template: `
    <form (ngSubmit)="handleSubmit()" [formGroup]="formGroup">
      <formly-form [fields]="fields" [form]="formGroup" [model]="model"></formly-form>
      <ng-content></ng-content>
    </form>
  `
})
export class TermsComponent {
  @Output() next = new EventEmitter();
  formGroup = new FormGroup({});
  model = { terms: false, gdpr: false };
  fields: FormlyFieldConfig[] = [
    formly.requiredCheckbox('terms', 'I hereby accept the terms and conditions of Eternal'),
    formly.requiredCheckbox('gdpr', 'I hereby accept that all my data is stored')
  ];

  handleSubmit() {
    if (this.formGroup.valid) {
      this.next.emit();
    }
  }
}

@NgModule({
  declarations: [TermsComponent],
  exports: [TermsComponent],
  imports: [ReactiveFormsModule, FormlyModule]
})
export class TermsComponentModule {}
