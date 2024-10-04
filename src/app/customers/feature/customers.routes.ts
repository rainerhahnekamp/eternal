import { AddCustomerComponent } from './components/add-customer.component';
import { CustomersContainerComponent } from './components/customers-container.component';
import { EditCustomerComponent } from './components/edit-customer.component';
import { dataGuard } from './services/data.guard';
import { CustomersRootComponent } from './components/customers-root/customers-root.component';
import {  provideCustomer } from '@app/customers/data';

export default [
  {
    path: '',
    canActivate: [dataGuard],
    component: CustomersRootComponent,
    providers: [
      provideCustomer(),
    ],
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
];
