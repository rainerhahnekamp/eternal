import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddressLookup {
  lookup(street: string, streetNumber: string): boolean {
    throw new Error('Method not implemented.');
  }
  constructor() {}
}
