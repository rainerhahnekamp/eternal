import { Component, effect, input, output } from '@angular/core';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CustomerPipe } from '../customer.pipe';
import { RouterLinkWithHref } from '@angular/router';
import { DatePipe, NgIf } from '@angular/common';
import { Customer } from '@app/customers/model';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    CustomerPipe,
    MatPaginatorModule,
    MatTableModule,
    MatSlideToggleModule,
    RouterLinkWithHref,
    NgIf,
    DatePipe,
  ],
})
export class CustomersComponent {
  customers = input.required<Customer[]>();
  setSelected = output<number>();
  setUnselected = output<number>();
  switchPage = output<number>();

  displayedColumns = ['name', 'country', 'birthdate', 'action'];
  dataSource = new MatTableDataSource();

  dataSourceUpdateEffect = effect(
    () => (this.dataSource.data = this.customers()),
  );

  toggleSelection(toggleChange: MatSlideToggleChange, id: number) {
    if (toggleChange.checked) {
      this.setSelected.emit(id);
    } else {
      this.setUnselected.emit(id);
    }
  }
}
