import { HttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { CustomerEffects } from './+state/customer.effects';
import { customerFeature } from './+state/customer.reducer';
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
      importProvidersFrom([
        StoreModule.forFeature(customerFeature),
        EffectsModule.forFeature([CustomerEffects])
      ])
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
