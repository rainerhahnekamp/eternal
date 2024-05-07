import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import {
  catchError,
  combineLatest,
  fromEvent,
  interval,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { withSilentLoadContext } from '@app/shared/ui-messaging';
import { isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class HeartbeatService {
  #isServer = isPlatformServer(inject(PLATFORM_ID));
  #httpClient = inject(HttpClient);

  #apiReachable$ = interval(5000).pipe(
    startWith(0),
    switchMap(() =>
      window.navigator.onLine
        ? this.#httpClient
            .get('/heartbeat', { context: withSilentLoadContext() })
            .pipe(
              map(() => true),
              catchError(() => of(false)),
            )
        : of(false),
    ),
  );
  #networkStatusChange = this.#isServer
    ? of()
    : fromEvent(window, 'online').pipe(startWith(window.navigator.onLine));

  readonly status = this.#isServer
    ? signal('connected')
    : toSignal(
        combineLatest([this.#apiReachable$, this.#networkStatusChange]).pipe(
          map(([apiReachable]) =>
            apiReachable && navigator.onLine ? 'connected' : 'disconnected',
          ),
        ),
      );
}
