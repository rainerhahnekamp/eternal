import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Configuration } from '@app/shared/config';
import { ChatService } from '@app/chat/chat.service';
import { MatButtonModule } from '@angular/material/button';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  template: `<h2 data-testid="greeting">Welcome to Eternal</h2>
    <p data-testid="txt-greeting-1">
      Eternal is an imaginary travel agency and is used as training application
      for Angular developers.
    </p>
    <p data-testid="txt-greeting-2">
      You can click around, do whatever you want but don't expect to be able to
      book a real holiday 😉.
    </p>
    <h3 class="mt-8 text-l font-bold">Settings</h3>
    <form [formGroup]="formGroup" class="flex flex-col gap-y-5">
      <mat-slide-toggle
        formControlName="mockCustomers"
        data-testid="tgl-mock-customers"
        >Mock Customers
      </mat-slide-toggle>
      <mat-slide-toggle
        formControlName="mockHolidays"
        data-testid="tgl-mock-holidays"
        >Mock Holidays
      </mat-slide-toggle>
    </form>
    <div class="w-72">
      <button class="my-4" mat-raised-button (click)="enableWebsocket()">
        Enable Chat
      </button>

      @switch (chatService.status()) {
        @case ('failed') {
          <p
            class="border border-red-400 rounded bg-red-100 px-4 py-3 text-red-700"
          >
            Could not establish connection
          </p>
        }
        @case ('connected') {
          <p
            class="border border-green-400 rounded bg-green-100 px-4 py-3 text-green-700"
          >
            Connection established
          </p>
        }
      }
    </div>
    @if (isBrowser) {
      <div class="text-right text-xs" data-testid="hydrated">
        Application is ready
      </div>
    } `,
  standalone: true,
  imports: [ReactiveFormsModule, MatSlideToggleModule, MatButtonModule],
})
export class HomeComponent implements OnInit {
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  config = inject(Configuration);
  formGroup = inject(NonNullableFormBuilder).group({
    mockCustomers: [true],
    mockHolidays: [true],
  });
  chatService = inject(ChatService);

  mockCustomers = new FormControl(true, {
    nonNullable: true,
  });

  mockHolidays = new FormControl(true, {
    nonNullable: true,
  });

  ngOnInit(): void {
    this.formGroup.setValue({
      mockCustomers: this.config.mockCustomers,
      mockHolidays: this.config.mockHolidays,
    });
    this.formGroup.valueChanges.subscribe(() =>
      this.config.updateFeatures(this.formGroup.getRawValue()),
    );
  }

  enableWebsocket() {
    this.chatService.connect();
  }
}
