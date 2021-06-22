import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { formly } from 'ngx-formly-helpers';

@Component({
  selector: 'app-sign-up-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
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
