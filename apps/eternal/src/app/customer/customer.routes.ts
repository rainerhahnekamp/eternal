import { HttpClient } from '@angular/common/http';
import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { CustomerEffects } from './+state/customer.effects';
import { customersFeature } from './+state/customer.reducer';
import { CustomerComponent } from './customer/customer.component';
import { CustomersComponent } from './customers/customers.component';
import { MockedHttpClient } from './mocked-http-client';

export const customerRoutes: Routes = [
  {
    path: '',
    providers: [
      {
        provide: HttpClient,
        useClass: environment.mockHttp ? MockedHttpClient : HttpClient
      },
      provideState(customersFeature),
      provideEffects([CustomerEffects])
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
