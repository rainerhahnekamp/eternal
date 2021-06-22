import { Component } from '@angular/core';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user$ = this.userService.loadedUser$;

  constructor(private userService: UserService) {}

  signOut() {
    this.userService.signOut();
  }
}
