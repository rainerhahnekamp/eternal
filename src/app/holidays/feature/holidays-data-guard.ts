import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromHolidays, holidaysActions } from '@app/holidays/data';
import { filter } from 'rxjs/operators';

export const holidaysDataGuard: CanActivateFn = () => {
  const store = inject(Store);
  store.dispatch(holidaysActions.get());
  return store.select(fromHolidays.selectIsLoaded).pipe(filter(Boolean));
};
