import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom, of } from 'rxjs';
import { AsyncPipe, NgIf, NgStyle } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { HolidayCardComponent } from '../holiday-card/holiday-card.component';
import { validateAddress } from '@app/shared';
import { HolidaysRepository } from '../+state';

@Component({
  selector: 'app-request-info',
  templateUrl: './request-info.component.html',
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
    RouterLink,
  ],
})
export class RequestInfoComponent implements OnInit {
  @Input() address = '';
  @Input() id: string | undefined;
  @Output() brochureSent = new EventEmitter<string>();

  #lookuper = { lookup: (query: string) => of(Boolean(query)) };
  #formBuilder = inject(NonNullableFormBuilder);
  #repo = inject(HolidaysRepository);

  protected lookupResult = signal('');
  protected formGroup = this.#formBuilder.group({
    address: ['', [validateAddress]],
  });
  protected holiday = this.#repo.selected;

  ngOnInit(): void {
    this.#repo.select(Number(this.id));

    if (this.address) {
      this.formGroup.setValue({ address: this.address });
    }
  }

  async search() {
    const isValid = await firstValueFrom(
      this.#lookuper.lookup(this.formGroup.getRawValue().address)
    );
    this.lookupResult.set(isValid ? 'Brochure sent' : 'Address not found');
  }
}
