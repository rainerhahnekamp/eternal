import { AddressLookuper, IAddressLookuper } from './address-lookuper.service';
import { Injectable, resource, ResourceRef } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddressLookuperFake implements IAddressLookuper {
  #nextValue = undefined as boolean | undefined;

  resolveToValueForNextCall(value: boolean) {
    this.#nextValue = value;
  }

  getLookupResource(query: string): ResourceRef<boolean | undefined> {
    return resource({
      params: () => query,
      loader: () => {
        if (this.#nextValue === undefined) {
          throw new Error('undefined for next Value is not allowed');
        }

        const promise = new Promise<boolean>((resolve) =>
          resolve(this.#nextValue as boolean),
        );
        this.#nextValue = undefined;
        return promise;
      },
    });
  }

  lookup(query: string): Observable<boolean> {
    return of(true);
  }
}

export const provideAddressLookuperFake = () => [
  { provide: AddressLookuper, useExisting: AddressLookuperFake },
];
