import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { formly } from 'ngx-formly-helpers';
import { countries } from '../../../customer/countries';

type UserType = 'customer' | 'agent';

export interface BasicData {
  userType: UserType;
}

@Component({
  selector: 'app-sign-up-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicComponent {
  @Output() next = new EventEmitter<BasicData>();
  formGroup = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    formly.requiredText('firstname', 'Firstname'),
    formly.requiredText('name', 'Name'),
    formly.requiredText('street', 'Street'),
    formly.requiredText('streetNumber', 'Streetnumber'),
    formly.requiredText('zip', 'PLZ'),
    formly.requiredText('city', 'City'),
    formly.requiredSelect('country', 'Country', countries),
    formly.requiredDate('birthdate', 'Birthdate')
  ];

  handleUserType(userType: UserType) {
    this.next.emit({ userType });
  }
}
