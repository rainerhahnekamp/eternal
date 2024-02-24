import {
  afterRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Flight } from './flight';

@Component({
  selector: 'app-flights',
  template: `
    @if (dataSource().data.length > 0) {
      <div class="my-4 max-w-screen-sm">
        <mat-table [dataSource]="dataSource()">
          <ng-container matColumnDef="id">
            <mat-header-cell *matHeaderCellDef> ID</mat-header-cell>
            <mat-cell *matCellDef="let element">{{ element.id }}</mat-cell>
          </ng-container>

          <ng-container matColumnDef="from">
            <mat-header-cell *matHeaderCellDef> From</mat-header-cell>
            <mat-cell *matCellDef="let element">{{ element.from }}</mat-cell>
          </ng-container>

          <ng-container matColumnDef="to">
            <mat-header-cell *matHeaderCellDef> To</mat-header-cell>
            <mat-cell *matCellDef="let element">{{ element.to }}</mat-cell>
          </ng-container>

          <ng-container matColumnDef="date">
            <mat-header-cell *matHeaderCellDef> Date</mat-header-cell>
            <mat-cell *matCellDef="let element">{{
              element.date | date: 'dd.MM.YYYY'
            }}</mat-cell>
          </ng-container>

          <ng-container matColumnDef="delayed">
            <mat-header-cell *matHeaderCellDef> Delayed</mat-header-cell>
            <mat-cell *matCellDef="let element"
              >{{ element.delayed }}
            </mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row
            *matRowDef="let row; columns: displayedColumns"
            data-testid="row-customer"
            [attr.aria-labelledby]="'customer-' + row.id"
          ></mat-row>
        </mat-table>
      </div>
    }
  `,
  standalone: true,
  imports: [DatePipe, MatTableModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightsComponent {
  flights = input.required<Flight[]>();

  displayedColumns = ['id', 'from', 'to', 'date', 'delayed'];
  dataSource = computed(() => new MatTableDataSource<Flight>(this.flights()));
}
