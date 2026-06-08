import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject, Service } from '@angular/core';

@Service()
export class NewsletterClient {
  httpClient = inject(HttpClient);

  send(email: string): Observable<boolean> {
    return this.httpClient.post<boolean>(
      'http://some.host.com/newsletter/subscribe',
      { email },
    );
  }
}
