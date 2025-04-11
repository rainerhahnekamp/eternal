import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { HeartbeatService } from '../heartbeat.service';
import { Configuration } from '../shared/config/configuration';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="p-2 background-color-toolbar">
      @if (isHydrated()) {
        <div
          class="text-xs flex items-center justify-end gap-2 text-grey-500"
          data-testid="hydrated"
        >
          <span>Application is ready</span>
          @if (apiReachable() === 'connected') {
            <mat-icon>wifi</mat-icon>
          } @else {
            <mat-icon class="text-red-500">wifi_off</mat-icon>
          }

          @if (config.runHeartbeat()) {
            <mat-icon>refresh</mat-icon>
          } @else {
            <mat-icon class="text-gray-400">refresh</mat-icon>
          }
        </div>
      }
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class FooterComponent {
  readonly isHydrated = signal(false);
  readonly apiReachable = inject(HeartbeatService).status;
  protected readonly config = inject(Configuration);

  constructor() {
    afterNextRender(() => this.isHydrated.set(true));
  }
}
