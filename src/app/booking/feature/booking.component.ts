import { Component, inject } from '@angular/core';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-booking',
  template: ``,
})
export class BookingComponent {
  userService = inject(UserService);
}
