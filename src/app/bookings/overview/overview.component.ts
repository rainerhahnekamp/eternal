import { Component, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { catchError, filter, of } from 'rxjs';
import { bookingsActions } from '../+state/bookings.actions';
import { Booking } from '../+state/bookings.reducer';
import { fromBookings } from '../+state/bookings.selectors';
import { DatePipe } from '@angular/common';
import { MessageService } from '@app/shared/ui-messaging';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    imports: [MatTableModule, DatePipe]
})
export class OverviewComponent {
  userName = '';
  displayedColumns = ['holidayId', 'date', 'status', 'comment'];
  dataSource = new MatTableDataSource<Booking>([]);

  #store = inject(Store);
  #uiMessage = inject(MessageService);

  constructor() {
    this.#store
      .select(fromBookings.selectBookingData)
      .pipe(
        takeUntilDestroyed(),
        filter(Boolean),
        catchError(() => {
          this.#uiMessage.error('Could not load bookings');
          return of({ loaded: true, customerName: '', bookings: [] });
        }),
      )
      .subscribe((bookingData) => {
        if (bookingData?.loaded === false) {
          this.#store.dispatch(bookingsActions.load());
        } else {
          this.userName = bookingData.customerName;
          this.dataSource.data = bookingData.bookings;
        }
      });
  }
}
