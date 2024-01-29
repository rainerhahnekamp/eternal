import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgIf, NgStyle } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { HolidaysRepository } from '../+state/holidays-repository.service';
import { HolidayCardComponent } from '@app/holidays/ui';

@Component({
  selector: 'app-request-info-holiday-card',
  template: `@if (holiday()) {
    <app-holiday-card
      [holiday]="holiday()"
      [requestBrochure]="false"
    ></app-holiday-card>
  } `,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    HolidayCardComponent,
    NgIf,
    AsyncPipe,
    NgStyle,
  ],
})
export class RequestInfoComponentHolidayCard implements OnInit {
  #route = inject(ActivatedRoute);
  #holidaysRepository = inject(HolidaysRepository);

  holiday = this.#holidaysRepository.selected;

  ngOnInit(): void {
    this.#route.paramMap.subscribe((paramMap) =>
      this.#holidaysRepository.select(Number(paramMap.get('holidayId'))),
    );
  }
}
