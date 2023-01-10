import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Configuration } from '../shared/configuration';
import { holidays } from './holidays.data';

@Injectable()
export class HolidaysInterceptor implements HttpInterceptor {
  #configuration = inject(Configuration);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.#configuration.mockHolidays) {
      return next.handle(req);
    }

    if (req.method === 'GET' && req.url.startsWith(`${this.#configuration.baseUrl}/holiday`)) {
      return of(new HttpResponse({ body: holidays }));
    }

    return next.handle(req);
  }
}
