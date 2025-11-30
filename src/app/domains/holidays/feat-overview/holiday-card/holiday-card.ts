import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { Holiday } from '../holiday';
import { QuillComponent } from '../../../../shared/form/quill/quill.component';

@Component({
  selector: 'app-holiday-card',
  templateUrl: './holiday-card.html',
  styleUrls: ['./holiday-card.scss'],
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgClass,
    RouterLinkWithHref,
    QuillComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HolidayCard {
  readonly holiday = input.required<Holiday & { isFavourite?: boolean }>();
  protected readonly useQuill = input(false);
  protected readonly isEditing = signal(false);
  readonly addFavourite = output<number>();
  readonly removeFavourite = output<number>();
  protected readonly isFavouriteEnabled = computed(
    () => 'isFavourite' in this.holiday(),
  );

  toggleEditing() {
    this.isEditing.update((value) => !value);
  }

  cancelEdit() {
    this.isEditing.set(false);
  }

  saveEdit() {
    console.log('save edit');
  }
}
