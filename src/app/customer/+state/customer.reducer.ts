import { createFeature, createReducer, on } from '@ngrx/store';
import { Customer } from '../customer';
import { customerActions } from './customer.actions';

export interface CustomerState {
  customers: Customer[];
  currentPage: number;
  pageCount: number;
}

export const initialState: CustomerState = {
  customers: [],
  currentPage: 0,
  pageCount: 0,
};

export const customersFeature = createFeature({
  name: 'customers',
  reducer: createReducer<CustomerState>(
    initialState,
    on(
      customerActions.load,
      (state): CustomerState => ({ ...state, currentPage: 0 }),
    ),
    on(
      customerActions.loaded,
      (state, { customers, pageCount }): CustomerState => ({
        ...state,
        customers,
        pageCount,
      }),
    ),
    on(
      customerActions.added,
      customerActions.updated,
      customerActions.removed,
      (): CustomerState => initialState,
    ),
    on(
      customerActions.previousPage,
      (state): CustomerState => ({
        ...state,
        currentPage: state.currentPage - 1,
      }),
    ),
    on(
      customerActions.nextPage,
      (state): CustomerState => ({
        ...state,
        currentPage: state.currentPage + 1,
      }),
    ),
    on(
      customerActions.previousPageSuccess,
      customerActions.nextPageSuccess,
      (state, { customers }): CustomerState => ({
        ...state,
        customers,
      }),
    ),
  ),
});
