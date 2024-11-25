import { Component, computed, inject, OnInit } from '@angular/core';
import { BookingsRepository } from '@app/bookings/+state/bookings-repository.service';
import { OverviewComponent } from '@app/bookings/overview/overview.component';
import { CustomersApi } from '@app/customers/api';

@Component({
  selector: 'app-overview-container',
  template: ` @if (viewModel(); as value) {
    <app-overview [viewModel]="value"></app-overview>
    }`,
  standalone: true,
  imports: [OverviewComponent],
})
export class OverviewContainerComponent implements OnInit {
  #repo = inject(BookingsRepository);

  #customersApi = inject(CustomersApi);

  viewModel = computed(() => {
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

  ngOnInit(): void {
    this.#repo.load();
  }
}
