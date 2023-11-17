import { createFeature, createReducer, on } from '@ngrx/store';
import { customersActions } from './customers.actions';
import { Customer } from '@app/customers/model';

export interface CustomersState {
  customers: Customer[];
  page: number;
  total: number;
  selectedId: number | undefined;
  isLoaded: boolean;
  hasError: boolean;
}

export const initialState: CustomersState = {
  customers: [],
  page: 0,
  total: 0,
  selectedId: undefined,
  isLoaded: false,
  hasError: false,
};

export const customersFeature = createFeature({
  name: 'customers',
  reducer: createReducer<CustomersState>(
    initialState,
    on(customersActions.init, (state): CustomersState => {
      if (state.hasError) {
        return initialState;
      }
      return state;
    }),
    on(
      customersActions.load,
      (state): CustomersState => ({
        ...state,
      }),
    ),
    on(
      customersActions.loadFailure,
      (state): CustomersState => ({ ...state, hasError: true }),
    ),
    on(
      customersActions.loadSuccess,
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
