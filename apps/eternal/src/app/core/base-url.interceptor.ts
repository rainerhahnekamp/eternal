import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../shared/base-url.token';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  #baseUrl = inject(BASE_URL);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!req.url.startsWith('/')) {
      return next.handle(req);
    }
    return next.handle(
      req.clone({
        url: `${this.#baseUrl}${req.url}`,
        withCredentials: true
      })
    );
  }
}
