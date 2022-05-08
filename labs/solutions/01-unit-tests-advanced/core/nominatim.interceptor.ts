import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NominatimInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.url.match(/nominatim\.openstreetmap\.org/)) {
      return next.handle(req.clone({ setHeaders: { NominatimId: '0129' } }));
    }

    return next.handle(req);
  }
}
