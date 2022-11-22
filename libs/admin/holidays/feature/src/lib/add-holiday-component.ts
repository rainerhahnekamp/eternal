import { Component, inject } from '@angular/core';
import { HolidayDetailComponent } from '@eternal/admin/holidays/ui';
import { Holiday } from '@eternal/admin/holidays/model';
import { HolidaysRepository } from '@eternal/admin/holidays/data';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@eternal/shared/ui-messaging';

@Component({
  selector: 'eternal-add-holiday',
  template:
    '<eternal-holiday-detail [holiday]="emptyHoliday" (save)="save($event)"></eternal-holiday-detail>',
  standalone: true,
  imports: [HolidayDetailComponent],
})
export class AddHolidayComponent {
  emptyHoliday: Holiday = { id: 0, name: '', description: '', trips: [] };
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
