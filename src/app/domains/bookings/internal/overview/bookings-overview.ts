import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Booking } from '../+state/bookings.reducer';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

export interface ViewModel {
  bookings: Booking[];
  customerName: string;
}

@Component({
  selector: 'app-overview',
  templateUrl: './bookings-overview.html',
  imports: [MatTableModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingsOverview {
  readonly viewModel = input.required<ViewModel>();
  protected displayedColumns = ['holidayId', 'date', 'status', 'comment'];
  protected dataSource = computed(
    () => new MatTableDataSource<Booking>(this.viewModel().bookings),
  );
}
