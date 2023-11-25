import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { CustomersEffects } from './+state/customers.effects';
import { customersFeature } from './+state/customers.reducer';
import { AddCustomerComponent } from './components/add-customer.component';
import { CustomersContainerComponent } from './components/customers-container.component';
import { EditCustomerComponent } from './components/edit-customer.component';
import { dataGuard } from './services/data.guard';
import { CustomersRootComponent } from './components/customers-root/customers-root.component';

export default [
  {
    path: '',
    canActivate: [dataGuard],
    component: CustomersRootComponent,
    providers: [
      provideState(customersFeature),
      provideEffects([CustomersEffects]),
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
