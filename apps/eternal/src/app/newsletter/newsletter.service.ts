import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  constructor(private httpClient: HttpClient) {}

  send(email: string): Observable<boolean> {
    return this.httpClient.post<boolean>('http://some.host.com/newsletter/subscribe', { email });
  }
}
