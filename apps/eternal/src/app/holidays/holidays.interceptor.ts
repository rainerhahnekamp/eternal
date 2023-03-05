import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { Configuration } from '../shared/configuration';
import { holidays } from './holidays.data';

export const holidaysInterceptor: HttpInterceptorFn = (req, next) => {
  const configuration = inject(Configuration);
  if (!configuration.mockHolidays) {
    return next(req);
  }

  if (req.method === 'GET' && req.url.startsWith(`${configuration.baseUrl}/holiday`)) {
    return of(new HttpResponse({ body: holidays }));
  }

  return next(req);
};
