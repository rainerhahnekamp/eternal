import { Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

type Data = { message?: string; status?: string };
export type CallbackFn<T> = (callback: (value: T) => void) => void;
export type WebSocketClient<T> = Observable<T> | CallbackFn<T>;

declare global {
  interface Window {
    wsClient: WebSocketClient<Data>;
  }
}

window.wsClient = webSocket<Data>('ws://localhost:8080');

export const getWsConnect = (): Observable<Data> => {
  const { wsClient } = window;
  if (wsClient instanceof Observable) {
    return wsClient;
  }
  return new Observable<Data>((subscriber) => {
    wsClient((data) => {
      subscriber.next(data);
    });
  });
};
