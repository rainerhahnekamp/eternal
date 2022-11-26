import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Holiday } from '@eternal/admin/holidays/model';
import { RouterLinkWithHref } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgIf } from '@angular/common';

export interface HolidaysViewModel {
  holidays: Holiday[];
  pageIndex: number;
  length: number;
}

@Component({
  selector: 'eternal-holidays',
  templateUrl: 'holidays.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    RouterLinkWithHref,
    MatIconModule,
    MatPaginatorModule,
    NgIf,
  ],
  styles: [
    `
      mat-header-cell {
        justify-content: center;
      }
      .mat-column-id {
        flex: 0 0 5em;
      }
      .mat-column-name {
        flex: 0 0 10em;
      }
      .mat-column-action {
        flex: 0 0 5em;
      }
    `,
  ],
})
export class HolidaysComponent {
  @Input() viewModel: HolidaysViewModel | undefined;
  @Output() setSelected = new EventEmitter<number>();
  @Output() setUnselected = new EventEmitter<number>();
  @Output() switchPage = new EventEmitter<number>();

  displayedColumns = ['id', 'name', 'description', 'hasCover', 'action'];
  dataSource = new MatTableDataSource<Holiday>([]);

  ngOnChanges(): void {
    if (this.viewModel) {
      this.dataSource.data = this.viewModel.holidays;
    }
  }
}
