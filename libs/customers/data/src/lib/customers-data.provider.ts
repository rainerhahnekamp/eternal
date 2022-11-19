import { CustomersEffects } from './customers.effects';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { customersFeature } from './customers.reducer';

export const customersDataProvider = [
  provideState(customersFeature),
  provideEffects([CustomersEffects]),
];
