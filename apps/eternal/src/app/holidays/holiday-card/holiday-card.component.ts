import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Holiday } from '../model/holiday';

@Component({
  selector: 'eternal-holiday-card',
  template: ` <div class="flex flex-wrap justify-evenly">
    <mat-card *ngIf="holiday" class="mt-4 max-w-xs">
      <mat-card-header>
        <mat-card-title>{{ holiday.title }}</mat-card-title>
        <mat-card-subtitle>{{ holiday.teaser }}</mat-card-subtitle>
      </mat-card-header>
      <img [src]="holiday.imageUrl" [alt]="holiday.title" />
      <mat-card-content>
        {{ holiday.description }}
      </mat-card-content>
      <mat-card-actions *ngIf="requestBrochure" class="justify-center">
        <a [routerLink]="['/holidays/request-info', holiday.id]" mat-raised-button
          >Request Brochure</a
        >
      </mat-card-actions>
    </mat-card>
  </div>`,
  standalone: true,
  imports: [MatCardModule, MatButtonModule, NgIf, RouterLink]
})
export class HolidayCardComponent {
  @Input() holiday: Holiday | undefined;
  @Input() requestBrochure = true;
}
