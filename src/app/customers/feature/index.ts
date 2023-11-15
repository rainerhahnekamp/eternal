import customersRoutes from '@app/customers/feature/customers.routes';
// eslint-disable-next-line @softarc/sheriff/deep-import
import { fromCustomers } from '@app/customers/data/customers.selectors';

export default customersRoutes;
export const selectSelectedCustomer = fromCustomers.selectSelectedCustomer;
