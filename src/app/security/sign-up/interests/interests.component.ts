import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { formly } from 'ngx-formly-helpers';

const mapToOptions = (records) =>
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
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.scss']
})
export class InterestsComponent {
  @Output() next = new EventEmitter<InterestsData>();
  formGroup = new FormGroup({});
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
