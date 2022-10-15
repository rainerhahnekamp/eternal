import { createFeature, createReducer, on } from '@ngrx/store';
import { Customer } from '../customer';
import { customerActions } from './customer.actions';

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

export const customersFeature = createFeature({
  name: 'customers',
  reducer: createReducer<State>(
    initialState,
    on(customerActions.load, (state) => ({ ...state, currentPage: 0 })),
    on(customerActions.loaded, (state, { customers, pageCount }) => ({
      ...state,
      customers,
      pageCount
    })),
    on(customerActions.added, customerActions.updated, customerActions.removed, () => initialState),
    on(customerActions.previousPage, (state) => ({
      ...state,
      currentPage: state.currentPage - 1
    })),
    on(customerActions.nextPage, (state) => ({
      ...state,
      currentPage: state.currentPage + 1
    })),
    on(
      customerActions.previousPageSuccess,
      customerActions.nextPageSuccess,
      (state, { customers }) => ({
        ...state,
        customers
      })
    )
  )
});
