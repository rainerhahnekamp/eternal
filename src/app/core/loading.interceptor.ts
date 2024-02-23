import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, tap } from 'rxjs/operators';
import { LoadingService } from '@app/shared';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.loading();

  return next(req).pipe(
    delay(500),
    tap((event) => {
      if (event instanceof HttpResponse) {
        loadingService.loaded();
      }
    }),
  );
};
