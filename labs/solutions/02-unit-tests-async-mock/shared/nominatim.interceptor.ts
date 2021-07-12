import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NominatimInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.match(/nominatim\.openstreetmap\.org/)) {
      return next.handle(req.clone({ setHeaders: { NominatimId: '0129' } }));
    }

    return next.handle(req);
  }
}
