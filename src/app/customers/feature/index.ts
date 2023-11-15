import customersRoutes from '@app/customers/feature/customers.routes';
import { fromCustomers } from '@app/customers/data';

export default customersRoutes;
export const selectSelectedCustomer = fromCustomers.selectSelectedCustomer;
