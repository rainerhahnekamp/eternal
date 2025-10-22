import { Message } from './message';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export const MessageStore = signalStore(
  { providedIn: 'root' },
  withState({ messages: [] as Message[] }),
  withMethods((store) => ({
    add(message: Message) {
      patchState(store, ({ messages }) => ({
        messages: [...messages, message],
      }));
    },
    remove(message: Message) {
      patchState(store, ({ messages }) => ({
        messages: messages.filter((m) => message !== m),
      }));
    },
  })),
);
