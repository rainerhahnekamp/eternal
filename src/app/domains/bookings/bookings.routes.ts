import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { bookingsFeature } from './internal/+state/bookings.reducer';
import { BookingsEffects } from './internal/+state/bookings.effects';
import { OverviewContainerComponent } from './internal/overview-container.component';

export default [
  {
    path: '',
    providers: [
      provideState(bookingsFeature),
      provideEffects([BookingsEffects]),
    ],
    component: OverviewContainerComponent,
  },
] satisfies Routes;
