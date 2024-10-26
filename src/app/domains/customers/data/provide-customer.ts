import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { EnvironmentProviders } from '@angular/core';
import { customersFeature } from './internal/customers.reducer';
import { CustomersEffects } from './internal/customers.effects';
export { CustomersStore } from './internal/customers-store.service';

export const provideCustomer = () =>
  [
    provideState(customersFeature),
    provideEffects([CustomersEffects]),
  ] as EnvironmentProviders[];
