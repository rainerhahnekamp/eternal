import { Component, inject } from '@angular/core';
import { HolidayDetailComponent } from '@app/admin/holidays/ui';
import { Holiday } from '@app/admin/holidays/model';
import { HolidaysRepository } from '@app/admin/holidays/data';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/shared/ui-messaging';

@Component({
  selector: 'app-add-holiday',
  template:
    '<app-holiday-detail [holiday]="emptyHoliday" (save)="save($event)"></app-holiday-detail>',
  standalone: true,
  imports: [HolidayDetailComponent],
})
export class AddHolidayComponent {
  emptyHoliday: Holiday = { id: 0, name: '', description: '' };
  #repo = inject(HolidaysRepository);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #messageService = inject(MessageService);

  save(holiday: Holiday) {
    this.#repo.add(holiday);
    this.#messageService.info('Holiday was added');
    this.#router.navigate(['..'], { relativeTo: this.#route });
  }
}
