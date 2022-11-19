import { CanActivate, UrlTree } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { fromHolidays, holidaysActions } from '@eternal/holidays/data';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HolidaysDataGuard implements CanActivate {
  #store = inject(Store);

  canActivate(): Observable<boolean | UrlTree> {
    this.#store.dispatch(holidaysActions.get());
    return this.#store
      .select(fromHolidays.selectIsLoaded)
      .pipe(filter(Boolean));
  }
}
