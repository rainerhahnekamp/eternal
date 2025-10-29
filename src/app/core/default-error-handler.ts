import { ErrorHandler, inject, Injectable, Injector } from '@angular/core';
import { MessageService } from '../shared/ui-messaging/message/message.service';

@Injectable()
export class DefaultErrorHandler implements ErrorHandler {
  readonly #injector = inject(Injector);

  handleError(error: unknown): void {
    const messageService = this.#injector.get(MessageService);
    messageService.error('We are sorry. An error happened.');
    console.error(error);
  }
}
