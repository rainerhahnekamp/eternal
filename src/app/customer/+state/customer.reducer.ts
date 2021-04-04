import { Action, createReducer, on } from '@ngrx/store';
import { Customer } from '../customer';
import { CustomerActions } from './customer.actions';

export const customerFeatureKey = 'Customer';

export interface State {
  customers: Customer[];
  currentPage: number;
  pageCount: number;
}

export interface CustomerAppState {
  [customerFeatureKey]: State;
}

export const initialState: State = {
  customers: [],
  currentPage: 0,
  pageCount: 0
};

const CustomerReducer = createReducer<State>(
  initialState,
  on(CustomerActions.load, (state) => ({ ...state, currentPage: 0 })),
  on(CustomerActions.loaded, (state, { customers, pageCount }) => ({
    ...state,
    customers,
    pageCount
  })),
  on(CustomerActions.added, (state, { customers }) => ({
    ...state,
    customers
  })),
  on(CustomerActions.updated, (state, { customers }) => ({
    ...state,
    customers
  })),
  on(CustomerActions.removed, (state, { customers }) => ({
    ...state,
    customers
  })),
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
);

export function reducer(state: State | undefined, action: Action) {
  return CustomerReducer(state, action);
}
