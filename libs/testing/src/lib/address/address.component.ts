import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AddressLookup } from '../address-lookup.service';
import { countries, Country } from '../countries';

export interface Address {
  street: string;
  streetNumber: string;
  zip: string;
  city: string;
  country: string;
}

@Component({
  selector: 'eternal-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  formGroup: FormGroup;
  title = 'Address Validation';
  countries: Country[] = countries;

  @Input()
  address: Address;
  lookupResult$: Observable<string>;

  constructor(
    private addressLookup: AddressLookup,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      street: [],
      streetNumber: [],
      zip: [],
      city: [],
      country: ['at']
    });
    if (this.address) {
      this.formGroup.setValue(this.address);
    }
  }

  search() {
    this.lookupResult$ = this.addressLookup
      .lookup(this.formGroup.value)
      .pipe(map(found => (found ? 'Address found' : 'Address not found')));
  }
}
