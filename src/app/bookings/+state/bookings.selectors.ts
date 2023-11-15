// eslint-disable-next-line @softarc/sheriff/dependency-rule
import { selectSelectedCustomer } from '@app/customers/feature';
import { createSelector } from '@ngrx/store';
import { bookingsFeature } from './bookings.reducer';

const { selectBookings, selectLoaded } = bookingsFeature;

const selectBookingData = createSelector(
  selectSelectedCustomer,
  selectBookings,
  selectLoaded,
  (customer, bookings, loaded) => {
    if (customer === undefined) {
      return undefined;
    }

    return {
      customerName: customer.name + ', ' + customer.firstname,
      bookings,
      loaded,
    };
  },
);

export const fromBookings = { selectBookings, selectBookingData };
