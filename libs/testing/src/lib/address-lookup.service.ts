import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Address } from './address/address.component';

@Injectable({
  providedIn: 'root'
})
export class AddressLookup {
  constructor(private httpClient: HttpClient) {}

  lookup(address: Address): Observable<boolean> {
    if (address.streetNumber && address.street) {
      const params = new HttpParams()
        .set('street', address.street + ' ' + address.streetNumber)
        .set('country', address.country)
        .set('json', '1')
        .set('format', 'jsonv2');
      return this.httpClient
        .get<unknown[]>('https://nominatim.openstreetmap.org/search.php', {
          params
        })
        .pipe(map(addresses => !!addresses.length));
    } else {
      return of(false);
    }
  }
}
