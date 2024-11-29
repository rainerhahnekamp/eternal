import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { SecurityStore } from '../../shared/security/security-store';
import { ChatService } from '../../chat/chat.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  imports: [MatButtonModule, RouterLink, MatBadgeModule],
})
export class SidemenuComponent {
  securityStore = inject(SecurityStore);
  chatService = inject(ChatService);
}
