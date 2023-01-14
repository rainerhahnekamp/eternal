import { Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { filter } from 'rxjs/operators';
import { customerActions } from '../+state/customer.actions';
import { fromCustomer } from '../+state/customer.selectors';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TestidDirective } from '../../shared/testid.directive';
import { FormErrorsComponent } from '../../shared/form-errors.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { countries } from '../countries';

@Component({
  selector: 'eternal-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    RouterLink,
    AsyncPipe,
    NgIf,
    TestidDirective,
    MatFormFieldModule,
    FormErrorsComponent,
    MatInputModule,
    MatSelectModule,
    NgForOf
  ]
})
export class CustomerComponent implements OnInit {
  formGroup = inject(NonNullableFormBuilder).group({
    id: [0],
    firstname: ['', [Validators.required]],
    name: ['', [Validators.required]],
    country: ['', [Validators.required]],
    birthdate: ['', [Validators.required]]
  });
  countries = countries;
  #store = inject(Store);
  #route = inject(ActivatedRoute);

  ngOnInit() {
    this.#store.dispatch(customerActions.load());
    if (this.#route.snapshot.data['mode'] === 'edit') {
      this.#store
        .select(fromCustomer.selectById(Number(this.#route.snapshot.params['id'])))
        .pipe(filter(Boolean), first())
        .subscribe((customer) => {
          this.formGroup.setValue(customer);
        });
    }
  }

  submit() {
    if (this.formGroup.valid) {
      const customer = this.formGroup.getRawValue();
      if (customer.id > 0) {
        this.#store.dispatch(customerActions.update({ customer }));
      } else {
        this.#store.dispatch(customerActions.add({ customer }));
      }
    }
  }

  remove() {
    if (confirm(`Really delete?`)) {
      this.#store.dispatch(customerActions.remove({ id: this.formGroup.getRawValue().id }));
    }
  }
}
