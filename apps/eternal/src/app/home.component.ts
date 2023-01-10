import { Component, inject, OnInit } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TestidDirective } from './shared/testid.directive';
import { Configuration } from './shared/configuration';

@Component({
  selector: 'eternal-home',
  template: `<h2 testid="greeting">Welcome to Eternal</h2>
    <p testid="txt-greeting-1">
      Eternal is an imaginary travel agency and is used as training application for Angular
      developers.
    </p>
    <p testid="txt-greeting-2">
      You can click around, do whatever you want but don't expect to be able to book a real holiday
      😉.
    </p>
    <h3 class="mt-8 text-l font-bold">Settings</h3>
    <form [formGroup]="formGroup">
      <p>
        <mat-slide-toggle formControlName="mockCustomers" testid="tgl-mock-customers"
          >Mock Customers
        </mat-slide-toggle>
      </p>
      <p>
        <mat-slide-toggle formControlName="mockHolidays" testid="tgl-mock-holidays"
          >Mock Holidays
        </mat-slide-toggle>
      </p>
      <p>
        <mat-slide-toggle formControlName="useTestid" testid="tgl-use-testid"
          >Use testid
        </mat-slide-toggle>
      </p>
    </form> `,
  standalone: true,
  imports: [ReactiveFormsModule, MatSlideToggleModule, TestidDirective]
})
export class HomeComponent implements OnInit {
  config = inject(Configuration);
  formGroup = inject(NonNullableFormBuilder).group({
    mockCustomers: [true],
    mockHolidays: [true],
    useTestid: [true]
  });

  mockCustomers = new FormControl(true, {
    nonNullable: true
  });

  mockHolidays = new FormControl(true, {
    nonNullable: true
  });

  useDataTestid = new FormControl(true, {
    nonNullable: true
  });

  ngOnInit(): void {
    this.formGroup.setValue({
      mockCustomers: this.config.mockCustomers,
      mockHolidays: this.config.mockHolidays,
      useTestid: this.config.useTestid
    });
    this.formGroup.valueChanges.subscribe(() =>
      this.config.updateFeatures(this.formGroup.getRawValue())
    );
  }
}
