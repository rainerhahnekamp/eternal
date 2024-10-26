import { createSelector } from '@ngrx/store';
import { customersFeature } from './customers.reducer';
import { Customer } from '../../model/customer';

const { selectCustomers, selectSelectedId } = customersFeature;

const selectById = (id: number) =>
  createSelector(selectCustomers, (state: Customer[]): Customer | undefined =>
    state.find((p) => p.id === id),
  );

const selectSelectedCustomer = createSelector(
  selectCustomers,
  selectSelectedId,
  (customers, selectedId): Customer | undefined =>
    customers.find((customer) => customer.id === selectedId),
);

const selectPagedCustomers = createSelector(
  selectCustomers,
  selectSelectedId,
  customersFeature.selectPage,
  customersFeature.selectTotal,
  (customers, selectedId, page, total) => ({
    customers: customers.map((customer) => ({
      ...customer,
      selected: customer.id === selectedId,
    })),
    pageIndex: page - 1,
    length: total,
  }),
);

export const fromCustomers = {
  selectCustomers,
  selectPagedCustomers,
  selectSelectedCustomer,
  selectById,
};
