import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Holiday } from '../model';
import { BlinkerDirective, ImageLoadedDirective } from '@app/shared';

@Component({
  selector: 'app-holiday-card',
  styleUrls: ['./holiday-card.component.scss'],
  template: ` <div class="flex flex-wrap justify-evenly">
    <mat-card
      *ngIf="holiday"
      class="mt-4 max-w-xs"
      [ngClass]="{ 'sold-out': holiday.soldOut }"
      appBlinker
      [attr.aria-labelledby]="'holiday-card-' + holiday.id"
      aria-labelledby="holiday-title"
    >
      <mat-card-header>
        <mat-card-title [id]="'holiday-card-' + holiday.id">{{
          holiday.title
        }}</mat-card-title>
        <mat-card-subtitle>{{ holiday.teaser }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <figure>
          <img [src]="holiday.imageUrl" [alt]="holiday.title" />
          <div class="badge-overlay">
            <span *ngIf="holiday.onSale" class="top-left badge">On Sale</span>
            <span *ngIf="holiday.soldOut" class="middle-full badge"
              >Sold out</span
            >
          </div>
        </figure>
        {{ holiday.description }}
      </mat-card-content>
      <mat-card-actions *ngIf="requestBrochure" class="justify-center">
        <a
          data-testid="btn-brochure"
          [routerLink]="['/holidays/request-info', holiday.id]"
          mat-raised-button
          >Get a Brochure</a
        >
      </mat-card-actions>
    </mat-card>
  </div>`,
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    NgIf,
    RouterLink,
    BlinkerDirective,
    ImageLoadedDirective,
    NgClass,
  ],
})
export class HolidayCardComponent {
  @Input({ required: true }) holiday: Holiday | undefined;
  @Input() requestBrochure = true;
}
