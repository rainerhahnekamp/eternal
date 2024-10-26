import { Routes } from '@angular/router';
import { dataGuard } from './internal/services/data.guard';
import { CustomersRootComponent } from './internal/components/customers-root/customers-root.component';
import { CustomersContainerComponent } from './internal/components/customers-container.component';
import { AddCustomerComponent } from './internal/components/add-customer.component';
import { EditCustomerComponent } from './internal/components/edit-customer.component';

export default [
  {
    path: '',
    canActivate: [dataGuard],
    component: CustomersRootComponent,
    children: [
      {
        path: '',
        component: CustomersContainerComponent,
      },
      {
        path: 'new',
        component: AddCustomerComponent,
        data: { mode: 'new' },
      },
      {
        path: ':id',
        component: EditCustomerComponent,
        data: { mode: 'edit' },
      },
    ],
  },
] satisfies Routes;
