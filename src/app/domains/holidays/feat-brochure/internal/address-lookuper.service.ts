import { inject, Injectable } from '@angular/core';
import { parseAddress } from './parse-address';
import { ADDRESS_SUPPLIER } from './address-supplier';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AddressLookuper {
  #counter = 0;
  private readonly httpClient = inject(HttpClient)

  get counter(): number {
    return this.#counter;
  }

  lookup(query: string): Observable<boolean> {
    parseAddress(query);
    this.#counter++;

    return this.httpClient.get<string[]>('https://nominatim.openstreetmap.org/search.php', {
      params: {
        format: 'jsonv2',
        q: query
      }
    }).pipe(map(addresses => addresses.some(address => address.startsWith(query))))
  }
}
