import { inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SecurityService } from '../security/security.service';

@Injectable({ providedIn: 'root' })
export class UserLoaderGuard implements CanActivate {
  securityService = inject(SecurityService);

  canActivate(): Observable<boolean> | boolean {
    return this.securityService.loaded$.pipe(filter(Boolean));
  }
}
