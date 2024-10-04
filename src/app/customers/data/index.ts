import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { customersFeature } from '@app/customers/data/customers.reducer';
import { CustomersEffects } from '@app/customers/data/customers.effects';
import { EnvironmentProviders } from '@angular/core';
export { customersInterceptor } from '@app/customers/data/customers.interceptor';
export { CustomersStore } from './customers-store.service';

export const provideCustomer = () =>
  [
    provideState(customersFeature),
    provideEffects([CustomersEffects]),
  ] as EnvironmentProviders[];

export {CustomerService} from './customer.service';
