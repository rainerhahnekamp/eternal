import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { httpResource } from '@angular/common/http';
import { parseHolidays } from './holiday';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-holidays',
  templateUrl: `./holidays.component.html`,
  styleUrl: './holidays.component.scss',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
  ],
})
export class HolidaysComponent {
  protected readonly holidays = httpResource(() => '/holiday', {
    defaultValue: [],
    parse: parseHolidays,
  });
}
