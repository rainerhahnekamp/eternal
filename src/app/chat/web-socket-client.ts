import { Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

type Data = { message?: string; status?: string };

declare global {
  interface Window {
    mockedClient?: (data: Data) => void;
    playwright: unknown;
  }
}

export const getWsConnect = (triggerCd: () => void): Observable<Data> => {
  if (window.playwright) {
    console.info('WebSocket is controlled by Playwright');
    return new Observable<Data>((subscriber) => {
      window.mockedClient = (data: Data) => {
        subscriber.next(data);
        triggerCd();
      };
    });
  } else {
    return webSocket<Data>('ws://localhost:8080');
  }
};
