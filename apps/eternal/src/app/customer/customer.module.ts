import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { CustomerEffects } from './+state/customer.effects';
import { customerFeatureKey, customerReducer } from './+state/customer.reducer';
import { CustomerComponent, CustomerComponentModule } from './customer/customer.component';
import { CustomersComponent, CustomersComponentModule } from './customers/customers.component';
import { MockedHttpClient } from './mocked-http-client';

@NgModule({
  providers: [
    {
      provide: HttpClient,
      useClass: environment.mockHttp ? MockedHttpClient : HttpClient
    }
  ],
  imports: [
    CustomerComponentModule,
    CustomersComponentModule,
    RouterModule.forChild([
      {
        path: '',
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
    ]),
    StoreModule.forFeature(customerFeatureKey, customerReducer),
    EffectsModule.forFeature([CustomerEffects])
  ]
})
export class CustomerModule {}
