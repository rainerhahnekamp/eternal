// ✅
import { CustomersApi } from './api/customers-api';
// ✅
import { CustomersStore } from './data/store';
// ✅
import { model } from './model/model';
// ✅
import { UI } from './ui/ui';
// ✅
import { CustomersClient } from '../api/customers-client';
// ✅
import { CustomerStore } from '../data/customer-store';
// ✅
import { createCustomer } from '../model/customer';
// ✅
import { CustomerView } from '../ui/customer/customer-view';

const api = CustomersApi
const data = CustomersStore
const m = model
const ui = UI
const client = CustomersClient
const store = CustomerStore
const customer = createCustomer()
const uiDomain = CustomerView
