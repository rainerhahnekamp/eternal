import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
  withRequestsMadeViaParent
} from '@angular/common/http';
import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { CustomerEffects } from './+state/customer.effects';
import { customersFeature } from './+state/customer.reducer';
import { CustomerComponent } from './customer/customer.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomersInterceptor } from './customers.interceptor';

const customerRoutes: Routes = [
  {
    path: '',
    providers: [
      provideState(customersFeature),
      provideEffects(CustomerEffects),
      provideHttpClient(withRequestsMadeViaParent(), withInterceptorsFromDi()),
      { provide: HTTP_INTERCEPTORS, useClass: CustomersInterceptor, multi: true }
    ],
    children: [
      {
        path: '',
        component: CustomersComponent
      },
      { path: 'new', component: CustomerComponent, data: { mode: 'new' } },
      {
        path: ':id',
        component: CustomerComponent,
        data: { mode: 'edit' }
      }
    ]
  }
];

export default customerRoutes;
