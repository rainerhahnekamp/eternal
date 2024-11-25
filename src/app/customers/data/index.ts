import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { customersFeature } from '@app/customers/data/customers.reducer';
import { CustomersEffects } from '@app/customers/data/customers.effects';

export const provideCustomers = () => [
  provideState(customersFeature),
  provideEffects([CustomersEffects]),
];
export { CustomersRepository } from './customers-repository.service';
