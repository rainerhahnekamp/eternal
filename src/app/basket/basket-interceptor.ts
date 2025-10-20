import { of } from 'rxjs';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';

export const basketInterceptor: HttpInterceptorFn = (req, handle) => {
  if (req.url.startsWith('/basket')) {
    console.group('Basket Request');
    console.log('Request URL: ', req.url);
    console.log('Request Body %o', req.body);
    console.groupEnd();
    return of(new HttpResponse({ body: null }));
  }
  return handle(req);
};
