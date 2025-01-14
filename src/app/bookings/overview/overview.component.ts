import { Component, Input } from '@angular/core';
import { Booking } from '../+state/bookings.reducer';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

export interface ViewModel {
  bookings: Booking[];
  customerName: string;
}

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    imports: [MatTableModule, CommonModule]
})
export class OverviewComponent {
  @Input() viewModel: ViewModel | undefined;
  displayedColumns = ['holidayId', 'date', 'status', 'comment'];
  dataSource = new MatTableDataSource<Booking>([]);
}
