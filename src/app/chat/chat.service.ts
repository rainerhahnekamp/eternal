import {
  ApplicationRef,
  inject,
  Injectable,
  NgZone,
  signal,
} from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { getWsConnect } from './web-socket-client';

interface Data {
  message?: string;
  status?: string;
}
export interface Message {
  text: string;
  sent: Date;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  #status = signal<'not connected' | 'connected' | 'failed'>('not connected');
  status = this.#status.asReadonly();
  #messages = signal<Message[]>([]);
  messages = this.#messages.asReadonly();
  appRef = inject(ApplicationRef);
  ngZone = inject(NgZone);

  connect() {
    getWsConnect(() => this.ngZone.run(() => this.appRef.tick()))
      .pipe(
        catchError((err) => {
          console.error(err);
          this.#status.set('failed');
          return new Observable<Data>((subscriber) => subscriber.complete());
        }),
        tap(() => {
          if (this.#status() === 'not connected') {
            this.#messages.set([]);
            this.#status.set('connected');
          }
        }),
        filter((data) => 'message' in data),
        map((data) => ({ text: data.message ?? '', sent: new Date() })),
      )
      .subscribe((message) => {
        this.#messages.update((value) => [...value, message]);
      });
  }
}
