import { createSelector } from '@ngrx/store';
import { Customer } from '../customer';
import { customerFeature } from './customer.reducer';

const selectAll = customerFeature.selectCustomers;

const selectById = (id: number) =>
  createSelector(selectAll, (state: Customer[]) => state.find((p) => p.id === id));

const { selectCurrentPage, selectPageCount } = customerFeature;

const selectCustomersAndPage = createSelector(
  selectAll,
  selectCurrentPage,
  selectPageCount,
  (customers, currentPage, pageCount) => ({
    customers,
    currentPage,
    pageCount
  })
);

export const fromCustomer = {
  selectAll,
  selectById,
  selectCurrentPage,
  selectCustomersAndPage
};
