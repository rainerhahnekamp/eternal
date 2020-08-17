import { AddressComponent } from './address.component';
import { ReactiveFormsModule } from '@angular/forms';

export default {
  title: 'AddressComponent'
};

export const primary = () => ({
  moduleMetadata: {
    imports: [ReactiveFormsModule]
  },
  component: AddressComponent,
  props: {}
});

export const filledIn = () => ({
  moduleMetadata: {
    imports: [ReactiveFormsModule]
  },
  cmponent: AddressComponent,
  props: {
    address: { street: 'Hauptstrasse' }
  }
});
