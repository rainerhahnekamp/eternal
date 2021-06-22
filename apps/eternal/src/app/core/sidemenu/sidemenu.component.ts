import { Component } from '@angular/core';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent {
  constructor(public userService: UserService) {}
}
