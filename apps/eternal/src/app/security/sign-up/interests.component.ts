import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import {FormGroup, ReactiveFormsModule, UntypedFormGroup} from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { formly } from 'ngx-formly-helpers';

const mapToOptions = (records: string[]) =>
  records.map((record) => ({
    label: record,
    value: record.toLowerCase()
  }));

export interface InterestsData {
  continents: string[];
  travelVariation: string[];
  favouredDuration: string;
  travelType: string;
  comment: string;
}

@Component({
  selector: 'app-sign-up-interests',
  template: `
    <form (ngSubmit)="handleSubmit()" [formGroup]="formGroup">
      <formly-form [fields]="fields" [form]="formGroup" [model]="{}"></formly-form>
      <ng-content></ng-content>
    </form>
  `
})
export class InterestsComponent {
  @Output() next = new EventEmitter<InterestsData>();
  formGroup = new UntypedFormGroup({});
  fields: FormlyFieldConfig[] = [
    formly.requiredMultiSelect(
      'continents',
      'Favoured Continents',
      mapToOptions(['Africa', 'America', 'Asia', 'Australia', 'Europe'])
    ),
    formly.field('travelVariation', 'multicheckbox', 'Favoured Travel Variation', {
      multi: true,
      options: mapToOptions(['Hiking', 'Culture', 'Adventure', 'Luxury', 'Culinary', 'Educational'])
    }),
    formly.requiredRadio('favouredDuration', 'Favoured Duration', [
      {
        label: 'One-Day Trip',
        value: 'day'
      },
      { label: 'Weekend', value: 'weekend' },
      {
        label: 'Week',
        value: 'week'
      },
      { label: '14 days', value: 'long' }
    ]),
    formly.requiredRadio('travelType', 'Travel Type', [
      {
        label: 'Individual',
        value: 'individual'
      },
      { label: 'Group', value: 'group' }
    ]),
    formly.textArea('comment', 'About Me')
  ];

  handleSubmit() {
    if (this.formGroup.valid) {
      this.next.emit(this.formGroup.value);
    }
  }
}

@NgModule({
  declarations: [InterestsComponent],
  imports: [ReactiveFormsModule, FormlyModule],
  exports: [InterestsComponent]
})
export class InterestsComponentModule {}
