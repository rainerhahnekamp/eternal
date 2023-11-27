import {
  Component,
  inject,
  Input,
  OnChanges,
  signal,
  Signal,
} from '@angular/core';
import { HolidaysRepository } from '@app/admin/holidays/data';
import { ActivatedRoute, Router } from '@angular/router';
import { Holiday } from '@app/admin/holidays/model';
import { HolidayDetailComponent } from '@app/admin/holidays/ui';
import { MessageService } from '@app/shared/ui-messaging';

@Component({
  selector: 'app-edit-holiday',
  template: `@if (holiday(); as value) {
    <app-holiday-detail
      [holiday]="value"
      (remove)="handleRemove()"
      (save)="handleSave($event)"
    ></app-holiday-detail>
    }`,
  standalone: true,
  imports: [HolidayDetailComponent],
})
export class EditHolidayComponent implements OnChanges {
  @Input() id = 0;
  ngOnChanges(): void {
    if (!this.id) {
      return;
    }

    this.holiday = this.#holidaysRepository.findById(Number(this.id));
  }
  #holidaysRepository = inject(HolidaysRepository);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #messageService = inject(MessageService);
  protected holiday: Signal<Holiday | undefined> = signal<Holiday | undefined>(
    undefined,
  );

  handleRemove() {
    this.#holidaysRepository.remove(this.id);
    this.#messageService.info('Holiday was removed');
    this.#router.navigate(['..'], { relativeTo: this.#route });
  }

  handleSave(holiday: Holiday) {
    this.#holidaysRepository.save({ ...holiday, id: this.id });
    this.#messageService.info('Holiday was saved');
    this.#router.navigate(['..'], { relativeTo: this.#route });
  }
}
