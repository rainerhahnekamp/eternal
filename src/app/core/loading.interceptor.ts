import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { LoadingService } from '@app/shared';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.loading();

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        loadingService.loaded();
      }
    })
  );
};
