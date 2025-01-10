import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class UserService {
   getUser() {
    return { id: 1, name: 'Konrad' };
  }

  logout() {
     console.log('User logged out');
  }

  login() {
      console.log('User logged in');
  }
}
