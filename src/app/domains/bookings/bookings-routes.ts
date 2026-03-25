import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { bookingsFeature } from './internal/+state/bookings.reducer';
import { BookingsEffects } from './internal/+state/bookings.effects';
import { BookingsOverviewPage } from './internal/bookings-overview-page';

export default [
  {
    path: '',
    providers: [
      provideState(bookingsFeature),
      provideEffects([BookingsEffects]),
    ],
    component: BookingsOverviewPage,
  },
] satisfies Routes;
