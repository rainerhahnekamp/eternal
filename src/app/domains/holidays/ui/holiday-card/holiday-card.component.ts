import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { Holiday } from '../../model/holiday';
import { QuillComponent } from '../../../../shared/form/quill/quill.component';

@Component({
  selector: 'app-holiday-card',
  templateUrl: './holiday-card.component.html',
  styleUrls: ['./holiday-card.component.scss'],
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgClass,
    RouterLinkWithHref,
    QuillComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HolidayCardComponent {
  holiday = input.required<Holiday & { isFavourite: boolean }>();
  isEditing = signal(false);
  addFavourite = output<number>();
  removeFavourite = output<number>();

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
