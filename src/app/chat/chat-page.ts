import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { ChatClient } from './chat-client';

@Component({
  selector: 'app-chat',
  template: ` <mat-list>
    <div mat-subheader>Messages</div>
    @for (message of messages(); track message.sent) {
      <mat-list-item data-testid="chat-message">
        <mat-icon matListItemIcon>chat</mat-icon>
        <div matListItemTitle>{{ message.text }}</div>
        <div matListItemLine>{{ message.sent | date }}</div>
      </mat-list-item>
    }
  </mat-list>`,
  imports: [MatListModule, MatIconModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChatPage {
  messages = inject(ChatClient).messages;
}
