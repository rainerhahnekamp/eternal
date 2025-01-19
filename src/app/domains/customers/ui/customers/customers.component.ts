import { Component, computed, input, output } from '@angular/core';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterLinkWithHref } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Customer } from '../../model/customer';
import { CustomerPipe } from '../internal/customer.pipe';

export interface CustomerWithSelected extends Customer {
  selected: boolean;
}

export interface CustomersViewModel {
  customers: CustomerWithSelected[];
  pageIndex: number;
  length: number;
}

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    MatSlideToggleModule,
    RouterLinkWithHref,
    DatePipe,
    CustomerPipe,
  ],
})
export class CustomersComponent {
  readonly viewModel = input.required<CustomersViewModel>();
  readonly setSelected = output<number>();
  readonly setUnselected = output<number>();
  readonly switchPage = output<number>();

  protected readonly displayedColumns = [
    'name',
    'country',
    'birthdate',
    'action',
  ];

  protected readonly dataSource = computed(
    () =>
      new MatTableDataSource<CustomerWithSelected>(this.viewModel().customers),
  );

  toggleSelection(toggleChange: MatSlideToggleChange, id: number) {
    if (toggleChange.checked) {
      this.setSelected.emit(id);
    } else {
      this.setUnselected.emit(id);
    }
  }
}
