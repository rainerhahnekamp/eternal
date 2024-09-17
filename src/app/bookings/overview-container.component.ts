import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { BookingsStore } from '@app/bookings/+state/bookings-store.service';
import { OverviewComponent } from '@app/bookings/overview/overview.component';
import { Customers } from '@app/customers/api';

@Component({
  selector: 'app-overview-container',
  template: ` @if (viewModel(); as value) {
    <app-overview [viewModel]="value"></app-overview>
  }`,
  standalone: true,
  imports: [OverviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewContainerComponent {
  #repo = inject(BookingsStore);

  #customersApi = inject(Customers);

  protected readonly viewModel = computed(() => {
    const bookings = this.#repo.bookings();
    const loaded = this.#repo.loaded();
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
    this.#repo.load();
  }
}
