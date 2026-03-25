import { HttpClient } from '@angular/common/http';
import { inject, Injectable, NgZone, PLATFORM_ID, signal } from '@angular/core';
import {
  catchError,
  combineLatest,
  EMPTY,
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
import { Configuration } from './shared/config/configuration';

@Injectable({ providedIn: 'root' })
export class Heartbeat {
  readonly #isServer = isPlatformServer(inject(PLATFORM_ID));
  readonly #httpClient = inject(HttpClient);
  readonly #ngZone = inject(NgZone);
  readonly #configuration = inject(Configuration);
  #apiWasAlreadyReachable = false;

  readonly #apiReachable$ = interval(5000).pipe(
    startWith(0),
    switchMap(() => {
      if (!this.#configuration.runHeartbeat() && this.#apiWasAlreadyReachable) {
        return EMPTY;
      }

      return window.navigator.onLine
        ? this.#httpClient
            .get('/heartbeat', {
              context: withContextTokens(
                SILENT_LOAD_CONTEXT,
                ANONYMOUS_CONTEXT,
              ),
            })
            .pipe(
              map(() => {
                this.#apiWasAlreadyReachable = true;
                return true;
              }),
              catchError(() => of(false)),
            )
        : of(false);
    }),
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
