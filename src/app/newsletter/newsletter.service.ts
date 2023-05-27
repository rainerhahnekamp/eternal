import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  constructor(private httpClient: HttpClient) {}

  send(email: string): Observable<boolean> {
    return this.httpClient.post<boolean>('http://some.host.com/newsletter/subscribe', { email });
  }
}
