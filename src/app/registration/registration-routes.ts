import { Routes } from '@angular/router';
import { ProductRegistrationScreen } from './product-registration-screen';
import { CustomerRegistrationScreen } from './customer-registration-screen';
import { AddressRegistrationScreen } from './address-registraton-screen';

export default [
  {
    path: '',
    children: [
      { path: 'product-selection', component: ProductRegistrationScreen },
      { path: 'customer', component: CustomerRegistrationScreen },
      { path: 'address', component: AddressRegistrationScreen },
    ],
  },
] satisfies Routes;
