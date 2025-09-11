// ❌ should not be allowed but not catched
import { CustomersApi } from '../api/customers-api';
// ❌ should not be allowed but not catched
import { CustomersStore } from '../data/store';
// ❌ should not be allowed but not catched
import { CustomersClient } from '../../api/customers-client';
// ❌ should not be allowed but not catched
import { CustomerStore } from '../../data/customer-store';
// ✅
import { CustomerView } from '../../ui/customer/customer-view';

export const UI = {}
const api = CustomersApi
const data = CustomersStore
const client = CustomersClient
const domainData = CustomerStore
const domainUi = CustomerView
