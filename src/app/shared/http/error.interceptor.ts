import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ERROR_MESSAGE_CONTEXT } from './error-message.context';
import { MessageService } from '@app/shared/ui-messaging';

export const errorInterceptor: HttpInterceptorFn = (req, handle) => {
  const uiMessage = inject(MessageService);

  return handle(req).pipe(
    catchError((err) => {
      const errorMessageContext = req.context.get(ERROR_MESSAGE_CONTEXT);
      uiMessage.error(errorMessageContext);
      return throwError(() => err);
    }),
  );
};
