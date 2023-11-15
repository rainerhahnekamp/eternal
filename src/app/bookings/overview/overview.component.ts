import { Component, effect, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Booking } from '../+state/bookings.reducer';
import { DatePipe } from '@angular/common';
import { BookingsRepository } from '@app/bookings/+state/bookings-repository.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  standalone: true,
  imports: [MatTableModule, DatePipe],
})
export class OverviewComponent implements OnInit {
  userName = '';
  displayedColumns = ['holidayId', 'date', 'status', 'comment'];
  dataSource = new MatTableDataSource<Booking>([]);

  #repo = inject(BookingsRepository);

  constructor() {
    effect(() => {
      const bookingData = this.#repo.bookingsData();
      if (!bookingData) {
        return;
      }
      if (bookingData.loaded) {
        this.userName = bookingData.customerName;
        this.dataSource.data = bookingData.bookings;
      }
    });
  }

  ngOnInit(): void {
    this.#repo.load();
  }
}
