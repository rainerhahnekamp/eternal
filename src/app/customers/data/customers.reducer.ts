import { createFeature, createReducer, on } from '@ngrx/store';
import { customersActions } from './customers.actions';
import { Customer } from '@app/customers/model';

export interface CustomersState {
  customers: Customer[];
  page: number;
  total: number;
  selectedId: number | undefined;
  isLoaded: boolean;
}

export const initialState: CustomersState = {
  customers: [],
  page: 0,
  total: 0,
  selectedId: undefined,
  isLoaded: false,
};

export const customersFeature = createFeature({
  name: 'customers',
  reducer: createReducer<CustomersState>(
    initialState,
    on(
      customersActions.load,
      (state): CustomersState => ({
        ...state,
      }),
    ),
    on(
      customersActions.loaded,
      (state, { customers, total, page }): CustomersState => ({
        ...state,
        customers,
        total,
        page,
        isLoaded: true,
      }),
    ),
    on(
      customersActions.select,
      (state, { id }): CustomersState => ({
        ...state,
        selectedId: id,
      }),
    ),
    on(
      customersActions.unselect,
      (state): CustomersState => ({
        ...state,
        selectedId: undefined,
      }),
    ),
  ),
});
