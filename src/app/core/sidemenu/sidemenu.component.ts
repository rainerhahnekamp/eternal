import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { ChatService } from '../../chat/chat.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  imports: [MatButtonModule, RouterLink, MatBadgeModule],
})
export class SidemenuComponent {
  chatService = inject(ChatService);
}
