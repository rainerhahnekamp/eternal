import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { CustomerEffects } from './+state/customer.effects';
import { customerFeatureKey, customerReducer } from './+state/customer.reducer';
import { CustomerPipe } from './customer.pipe';
import { CustomerComponent } from './customer/customer.component';
import { CustomersComponent } from './customers/customers.component';

@NgModule({
  declarations: [CustomersComponent, CustomerComponent, CustomerPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    FormlyModule.forChild(),
    FormlyMaterialModule,
    FormlyMatDatepickerModule,
    MatNativeDateModule,
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
