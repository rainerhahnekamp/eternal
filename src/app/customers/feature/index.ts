import customersRoutes from '@app/customers/feature/customers.routes';
import { fromCustomers } from '@app/customers/feature/+state/customers.selectors';

export default customersRoutes;
export const selectSelectedCustomer = fromCustomers.selectSelectedCustomer;
