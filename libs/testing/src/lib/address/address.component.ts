import { Component, OnInit, Input } from '@angular/core';
import { AddressLookup } from '../address-lookup.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

export interface Address {
  street: string;
  streetNumber: string;
  zip: string;
  city: string;
}

@Component({
  selector: 'eternal-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  formGroup: FormGroup;
  title = 'Address Validation';
  @Input() address: Address;

  constructor(
    private addressLookup: AddressLookup,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      street: [],
      streetNumber: [],
      zip: [],
      city: []
    });
    if (this.address) {
      this.formGroup.setValue(this.address);
    }
  }

  search(): boolean {
    return this.addressLookup.lookup(this.formGroup.value);
  }
}
