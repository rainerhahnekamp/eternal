import { createSelector } from '@ngrx/store';
import { Customer } from '../customer';
import { customersFeature } from './customer.reducer';

const selectAll = customersFeature.selectCustomers;

const selectById = (id: number) =>
  createSelector(selectAll, (state: Customer[]) => state.find((p) => p.id === id));

const { selectCurrentPage, selectPageCount } = customersFeature;

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
