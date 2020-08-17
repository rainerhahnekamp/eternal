import { Injectable } from '@angular/core';
import { Address } from './address/address.component';

@Injectable({
  providedIn: 'root'
})
export class AddressLookup {
  lookup(address: Address): boolean {
    throw new Error('Method not implemented.');
  }
  constructor() {}
}
