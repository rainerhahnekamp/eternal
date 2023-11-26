import { Component, computed, inject, Signal } from '@angular/core';
import { HolidaysRepository } from '@app/admin/holidays/data';
import { ActivatedRoute, Router } from '@angular/router';
import { Holiday } from '@app/admin/holidays/model';
import { HolidayDetailComponent } from '@app/admin/holidays/ui';
import { MessageService } from '@app/shared/ui-messaging';
import { toSignal } from '@angular/core/rxjs-interop';

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
export class EditHolidayComponent {
  #id = 0;
  #holidaysRepository = inject(HolidaysRepository);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #messageService = inject(MessageService);
  paramMap = toSignal(this.#route.paramMap);

  protected holiday: Signal<Holiday | undefined> = computed(() => {
    const paramMap = this.paramMap();

    const id = paramMap?.get('id');
    if (!id) {
      return;
    }

    const holiday = this.#holidaysRepository.findById(Number(id));
    return holiday();
  });

  handleRemove() {
    this.#holidaysRepository.remove(this.#id);
    this.#messageService.info('Holiday was removed');
    this.#router.navigate(['..'], { relativeTo: this.#route });
  }

  handleSave(holiday: Holiday) {
    this.#holidaysRepository.save({ ...holiday, id: this.#id });
    this.#messageService.info('Holiday was saved');
    this.#router.navigate(['..'], { relativeTo: this.#route });
  }
}
