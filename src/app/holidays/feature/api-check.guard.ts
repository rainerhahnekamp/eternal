import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const apiCheckGuard = (): Observable<boolean> => {
  const httpClient = inject(HttpClient);

  return httpClient.get('/holiday').pipe(map(() => true));
};
