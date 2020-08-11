import { Component, OnInit } from '@angular/core';
import { AddressLookup } from '../address-lookup.service';

@Component({
  selector: 'eternal-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent {
  street: string;
  streetNumber: string;

  constructor(private addressLookup: AddressLookup) {}

  search(): boolean {
    return this.addressLookup.lookup(this.street, this.streetNumber);
  }
}
