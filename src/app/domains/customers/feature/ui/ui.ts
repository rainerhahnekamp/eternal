// ❌ should not be allowed
import { CustomersApi } from '../api/customers-api';
// ❌ should not be allowed
import { CustomersStore } from '../data/store';
// ❌ should not be allowed
import { CustomersClient } from '../../api/customers-client';

export const UI = {}
const api = CustomersApi
const data = CustomersStore
const client = CustomersClient
