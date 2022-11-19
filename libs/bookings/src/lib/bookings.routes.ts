import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { bookingsFeature } from './+state/bookings.reducer';
import { BookingsEffects } from './+state/bookings.effects';
import { OverviewContainerComponent } from './overview-container/overview-container.component';

export const bookingsRoutes: Routes = [
  {
    path: '',
    providers: [
      provideState(bookingsFeature),
      provideEffects([BookingsEffects]),
    ],
    component: OverviewContainerComponent,
  },
];
