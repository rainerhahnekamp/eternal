import { inject, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class AddressAsyncValidator {
  #httpClient = inject(HttpClient);

  validate(ac: AbstractControl<string>): Observable<ValidationErrors | null> {
    return this.#httpClient
      .get<unknown[]>('https://nominatim.openstreetmap.org/search.php', {
        params: new HttpParams().set('format', 'jsonv2').set('q', ac.value),
      })
      .pipe(
        map((addresses) =>
          addresses.length > 0 ? null : { address: 'invalid' },
        ),
      );
  }
}
