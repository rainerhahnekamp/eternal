import { Routes } from '@angular/router';
import { dataGuard } from './internal/data.guard';
import { CustomersRootPage } from './internal/customers-root-page';
import { CustomersPage } from './internal/customers-page';
import { AddCustomerPage } from './internal/add-customer-page';
import { EditCustomerPage } from './internal/edit-customer-page';

export default [
  {
    path: '',
    canActivate: [dataGuard],
    component: CustomersRootPage,
    children: [
      {
        path: '',
        component: CustomersPage,
      },
      {
        path: 'new',
        component: AddCustomerPage,
        data: { mode: 'new' },
      },
      {
        path: ':id',
        component: EditCustomerPage,
        data: { mode: 'edit' },
      },
    ],
  },
] satisfies Routes;
