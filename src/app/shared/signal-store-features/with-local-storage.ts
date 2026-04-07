import { inject } from '@angular/core';
import {
  getState,
  patchState,
  signalStoreFeature,
  withHooks,
  withMethods,
} from '@ngrx/signals';
import { MessageService } from '../ui-messaging/message/message.service';
import { SignalStoreFeatureType } from '../util/signal-store-feature-type';

export type LocalStorageFeature = SignalStoreFeatureType<
  typeof withLocalStorage
>;

export function withLocalStorage(
  storageKey: string,
  name: string,
  autoLoad = true,
) {
  return signalStoreFeature(
    withMethods((store, messageService = inject(MessageService)) => ({
      syncToStorage() {
        const state = getState(store);
        localStorage.setItem(storageKey, JSON.stringify(state));
        messageService.info(`${name} saved for offline usage`);
      },
      loadFromStorage() {
        const data = localStorage.getItem(storageKey);
        if (!data) {
          return;
        }

        const state = JSON.parse(data);
        patchState(store, state);
      },
    })),
    withHooks((store) => ({
      onInit() {
        if (autoLoad) {
          store.loadFromStorage();
        }
      },
    })),
  );
}
