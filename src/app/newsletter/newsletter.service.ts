import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class NewsletterService {
  #httpClient = inject(HttpClient);

  send(email: string): Observable<boolean> {
    return this.#httpClient.post<boolean>(
      'http://some.host.com/newsletter/subscribe',
      { email }
    );
  }
}
