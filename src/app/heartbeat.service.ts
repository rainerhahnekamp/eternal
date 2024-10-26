import { HttpClient } from '@angular/common/http';
import { inject, Injectable, NgZone, PLATFORM_ID, signal } from '@angular/core';
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
import { isPlatformServer } from '@angular/common';
import { withContextTokens } from './shared/ui-messaging/loader/context';
import { SILENT_LOAD_CONTEXT } from './shared/http/silent-load.context';
import { ANONYMOUS_CONTEXT } from './shared/http/anonymous.context';

@Injectable({ providedIn: 'root' })
export class HeartbeatService {
  readonly #isServer = isPlatformServer(inject(PLATFORM_ID));
  readonly #httpClient = inject(HttpClient);
  readonly #ngZone = inject(NgZone);

  readonly #apiReachable$ = interval(5000).pipe(
    startWith(0),
    switchMap(() =>
      window.navigator.onLine
        ? this.#httpClient
            .get('/heartbeat', {
              context: withContextTokens(
                SILENT_LOAD_CONTEXT,
                ANONYMOUS_CONTEXT,
              ),
            })
            .pipe(
              map(() => true),
              catchError(() => of(false)),
            )
        : of(false),
    ),
  );

  readonly #networkStatusChange = this.#isServer
    ? of()
    : fromEvent(window, 'online').pipe(startWith(window.navigator.onLine));

  readonly status = this.#ngZone.runOutsideAngular(() =>
    this.#isServer
      ? signal('connected')
      : toSignal(
          combineLatest([this.#apiReachable$, this.#networkStatusChange]).pipe(
            map(([apiReachable]) =>
              apiReachable && navigator.onLine ? 'connected' : 'disconnected',
            ),
          ),
        ),
  );
}
