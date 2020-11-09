import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {RouterModule} from '@angular/router';
import {ReactiveComponentModule} from '@ngrx/component';
import {StoreModule} from '@ngrx/store';
import {holidaysFeatureKey, holidaysReducer} from './+state/holidays.reducer';
import {HolidaysComponent} from './holidays/holidays.component';

@NgModule({
  declarations: [HolidaysComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    RouterModule.forChild([
      {
        path: 'holidays',
        component: HolidaysComponent
      }
    ]),
    StoreModule.forFeature(holidaysFeatureKey, holidaysReducer),
    ReactiveComponentModule
  ]
})
export class HolidaysModule {
}
