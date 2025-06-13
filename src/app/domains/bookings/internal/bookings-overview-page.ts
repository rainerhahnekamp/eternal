import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { BookingsOverview } from './overview/bookings-overview';
import { CustomersClient } from '../../customers/api/customers-client';
import { injectDispatch } from '@ngrx/signals/events';
import { bookingEvents, BookingsStore } from './state/bookings-store';

@Component({
  selector: 'app-overview-container',
  template: ` @if (viewModel(); as value) {
    <app-overview [viewModel]="value"></app-overview>
  }`,
  imports: [BookingsOverview],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingsOverviewPage {
  readonly #dispatcher = injectDispatch(bookingEvents);
  readonly #bookingsStore = inject(BookingsStore);
  #customersApi = inject(CustomersClient);

  protected readonly viewModel = computed(() => {
    const bookings = this.#bookingsStore.bookings();
    const loaded = this.#bookingsStore.loaded();
    const customer = this.#customersApi.selectedCustomer();

    if (!loaded || !customer) {
      return false;
    }

    return {
      customerName: `${customer.name}, ${customer.firstname}`,
      bookings,
    };
  });

  constructor() {
    this.#dispatcher.load();
  }
}
