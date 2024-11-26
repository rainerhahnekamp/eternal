import {
  patchState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { lastValueFrom, pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tapResponse } from '@ngrx/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../ui-messaging';

export function withCrud<Entity extends { id: number }>(
  baseUrl: string,
  forwardUrl: string,
) {
  return signalStoreFeature(
    withEntities<Entity>(),
    withState({
      page: 0,
      total: 0,
    }),
    withMethods((store, httpClient = inject(HttpClient)) => ({
      load: rxMethod<number>(
        pipe(
          switchMap((page) =>
            httpClient
              .get<{ content: Entity[]; total: number }>(baseUrl, {
                params: new HttpParams().set('page', page),
              })
              .pipe(
                tapResponse({
                  next: ({ content, total }) =>
                    patchState(store, { total, page }, setAllEntities(content)),
                  error: console.error,
                }),
              ),
          ),
        ),
      ),
    })),

    withMethods(
      (
        store,
        httpClient = inject(HttpClient),
        router = inject(Router),
        uiMessage = inject(MessageService),
      ) => ({
        async add(entity: Entity) {
          await lastValueFrom(httpClient.post(baseUrl, entity));

          store.load(0);
          await router.navigateByUrl(forwardUrl);
        },
        async update(entity: Entity, message: string) {
          await lastValueFrom(httpClient.put(baseUrl, entity));

          uiMessage.info(message);
          store.load(0);
        },
        async remove(entity: Entity) {
          await lastValueFrom(httpClient.delete(`${baseUrl}/${entity.id}`));

          store.load(0);
          await router.navigateByUrl(forwardUrl);
        },
      }),
    ),
  );
}
