import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  httpClient = inject(HttpClient);

  email = '';

  send(email: string): Observable<boolean> {
    this.email = email;
    return this.httpClient.post<boolean>(
      'http://some.host.com/newsletter/subscribe',
      { email },
    );
  }
}
