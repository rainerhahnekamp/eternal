import { createFeature, createReducer, on } from '@ngrx/store';
import { Customer } from '../customer';
import { CustomerActions } from './customer.actions';

export interface State {
  customers: Customer[];
  currentPage: number;
  pageCount: number;
}

export const initialState: State = {
  customers: [],
  currentPage: 0,
  pageCount: 0
};

export const customerFeature = createFeature({
  name: 'customer',
  reducer: createReducer<State>(
    initialState,
    on(CustomerActions.load, (state) => ({ ...state, currentPage: 0 })),
    on(CustomerActions.loaded, (state, { customers, pageCount }) => ({
      ...state,
      customers,
      pageCount
    })),
    on(CustomerActions.added, CustomerActions.updated, CustomerActions.removed, () => initialState),
    on(CustomerActions.previousPage, (state) => ({
      ...state,
      currentPage: state.currentPage - 1
    })),
    on(CustomerActions.nextPage, (state) => ({
      ...state,
      currentPage: state.currentPage + 1
    })),
    on(
      CustomerActions.previousPageSuccess,
      CustomerActions.nextPageSuccess,
      (state, { customers }) => ({
        ...state,
        customers
      })
    )
  )
});
