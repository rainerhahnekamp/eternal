import { signalStore } from '@ngrx/signals';
import { withFeatureHooks } from './features/4-hooks';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

interface CustomersState {
  page: number;
  total: number;
}

const initialState: CustomersState = {
  page: 0,
  total: 0,
};

const baseUrl = '/customer';

export const CustomerStore = signalStore(
  { providedIn: 'root' },
  withDevtools('customers'),
  withFeatureHooks(),
);
