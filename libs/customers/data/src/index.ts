import { customersActions as allCustomersActions } from './lib/customers.actions';

const { add, load, remove, select, unselect, update } = allCustomersActions;

export const customersActions = { load, add, update, remove, select, unselect };
export { fromCustomers } from './lib/customers.selectors';
export { customersDataProvider } from './lib/customers-data.provider';
export { CustomersRepository } from './lib/customers-repository.service';
