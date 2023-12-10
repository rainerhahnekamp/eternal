import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SILENT_LOAD_CONTEXT } from './silent-load.context';
import { LoadingService } from '@app/shared/ui-messaging/loader/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, handle) => {
  const loadingService = inject(LoadingService);
  if (req.context.get(SILENT_LOAD_CONTEXT)) {
    return handle(req);
  }

  loadingService.start();
  return handle(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        loadingService.stop();
      }
    }),
    catchError((err) => {
      loadingService.stop();
      return throwError(() => err);
    }),
  );
};
