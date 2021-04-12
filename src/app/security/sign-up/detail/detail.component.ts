import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { formly } from 'ngx-formly-helpers';
import { countries } from '../../../customer/countries';
import { SignUpForm } from '../sign-up-form';

export interface DetailData {
  firstname: string;
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  street: string;
  streetNumber: string;
  zip: string;
  city: string;
  country: string;
  birthdate: Date;
}

@Component({
  selector: 'app-sign-up-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements SignUpForm {
  @Output() next = new EventEmitter<DetailData>();
  formGroup = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    formly.requiredText('email', 'EMail'),
    formly.requiredText('password', 'Password', { type: 'password' }),
    formly.requiredText('passwordConfirm', 'Password Confirmation', { type: 'password' }),
    formly.requiredText('firstname', 'Firstname'),
    formly.requiredText('name', 'Name'),
    formly.requiredText('street', 'Street'),
    formly.requiredText('streetNumber', 'Streetnumber'),
    formly.requiredText('zip', 'ZIP'),
    formly.requiredText('city', 'City'),
    formly.requiredSelect('country', 'Country', countries),
    formly.requiredDate('birthdate', 'Birthdate')
  ];

  handleSubmit() {
    if (this.formGroup.valid) {
      this.next.emit(this.formGroup.value);
    }
  }
}
