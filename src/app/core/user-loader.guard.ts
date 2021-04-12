import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UserService } from '../shared/user.service';

@Injectable({ providedIn: 'root' })
export class UserLoaderGuard implements CanActivate {
  constructor(private userService: UserService) {}

  canActivate(): Observable<boolean> | boolean {
    return this.userService.loaded$.pipe(
      map((loaded) => {
        if (!loaded) {
          this.userService.load();
        }
        return loaded;
      }),
      filter((loaded) => loaded)
    );
  }
}
