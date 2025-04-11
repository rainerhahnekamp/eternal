import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  imports: [MatButtonModule, RouterLink, MatBadgeModule],
})
export class SidemenuComponent {}
