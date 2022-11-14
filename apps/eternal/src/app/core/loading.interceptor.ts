import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoadingService } from '../shared/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  #loadingService = inject(LoadingService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.#loadingService.loading();

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.#loadingService.loaded();
        }
      })
    );
  }
}
