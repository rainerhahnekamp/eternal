import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent {
  constructor(public userService: UserService) {}
}

@NgModule({
  imports: [CommonModule, MatButtonModule, RouterModule],
  declarations: [SidemenuComponent],
  exports: [SidemenuComponent]
})
export class SidemenuComponentModule {}
