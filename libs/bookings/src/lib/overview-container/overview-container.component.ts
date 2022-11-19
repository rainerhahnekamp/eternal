import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { BookingsRepository } from '../+state/bookings-repository.service';
import { CustomersApi } from '@eternal/customers/api';
import { OverviewComponent, ViewModel } from '../overview/overview.component';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { LetModule } from '@ngrx/component';

@Component({
  selector: 'eternal-overview-container',
  template: `<eternal-overview
    *ngrxLet="viewModel$ as viewModel"
    [viewModel]="viewModel"
  ></eternal-overview>`,
  standalone: true,
  imports: [MatTableModule, OverviewComponent, AsyncPipe, NgIf, LetModule],
})
export class OverviewContainerComponent {
  #bookingsRepository = inject(BookingsRepository);
  #customersApi = inject(CustomersApi);

  readonly viewModel$: Observable<ViewModel> = combineLatest({
    bookings: this.#bookingsRepository.bookings$,
    loaded: this.#bookingsRepository.loaded$,
    customer: this.#customersApi.selectedCustomer$,
  }).pipe(
    filter(({ loaded }) => loaded),
    map(({ customer, bookings }) => ({
      customerName: `${customer.name}, ${customer.firstname}`,
      bookings,
    }))
  );
}
