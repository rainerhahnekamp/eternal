import { customersActions as actions } from './customers.actions';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { customersFeature } from '@app/customers/data/customers.reducer';
import { CustomersEffects } from '@app/customers/data/customers.effects';

const { add, load, remove, select, unselect, update } = actions;
export const customersActions = { load, add, update, remove, select, unselect };

export const provideCustomers = () => [
  provideState(customersFeature),
  provideEffects([CustomersEffects]),
];

export { fromCustomers } from './customers.selectors';
