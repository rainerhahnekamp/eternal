import { Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

interface Data {
  message?: string;
  status?: string;
}

declare global {
  interface Window {
    mockedClient?: (data: Data) => void;
    e2e: unknown;
  }
}

export const getWsConnect = (triggerCd: () => void): Observable<Data> => {
  if (window.e2e) {
    console.info('WebSocket is controlled by the E2E Framework');
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
