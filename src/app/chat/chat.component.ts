import { Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  template: ` <mat-list>
    <div mat-subheader>Messages</div>
    @for (message of messages; track message.id) {
      <mat-list-item>
        <mat-icon matListItemIcon>chat</mat-icon>
        <div matListItemTitle>{{ message.text }}</div>
        <div matListItemLine>{{ message.sent | date }}</div>
      </mat-list-item>
    }
  </mat-list>`,
  imports: [MatListModule, MatIconModule, DatePipe],
  standalone: true,
})
export class ChatComponent {
  messages = inject(ChatService).messages;
}
