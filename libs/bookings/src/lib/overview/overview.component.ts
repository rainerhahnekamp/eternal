import { Component, Input } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Booking } from '../+state/bookings.reducer';
import { DatePipe, NgIf } from '@angular/common';

export interface ViewModel {
  bookings: Booking[];
  customerName: string;
}

@Component({
  selector: 'eternal-overview',
  templateUrl: './overview.component.html',
  standalone: true,
  imports: [MatTableModule, DatePipe, NgIf],
})
export class OverviewComponent {
  @Input() viewModel: ViewModel | undefined;
  displayedColumns = ['holidayId', 'date', 'status', 'comment'];
  dataSource = new MatTableDataSource<Booking>([]);
}
