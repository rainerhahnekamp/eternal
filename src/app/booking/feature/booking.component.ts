import { Component, inject } from '@angular/core';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-booking',
  template: `<h1>Booking Component</h1><p>I don't do anything</p>`,
})
export class BookingComponent {
  userService = inject(UserService);
}
