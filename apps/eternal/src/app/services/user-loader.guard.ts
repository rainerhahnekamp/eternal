import { inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SecurityService } from '@eternal/shared/security';
import { filterTruthy } from '@eternal/shared/ngrx-utils';

@Injectable({ providedIn: 'root' })
export class UserLoaderGuard implements CanActivate {
  #securityService = inject(SecurityService);

  canActivate(): Observable<boolean> | boolean {
    return this.#securityService.loaded$.pipe(filterTruthy);
  }
}
