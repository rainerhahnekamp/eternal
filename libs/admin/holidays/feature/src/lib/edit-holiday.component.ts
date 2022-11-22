import { Component, inject, OnInit } from '@angular/core';
import { HolidaysRepository } from '@eternal/admin/holidays/data';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Holiday } from '@eternal/admin/holidays/model';
import { filterDefined } from '@eternal/shared/ngrx-utils';
import { HolidayDetailComponent } from '@eternal/admin/holidays/ui';
import { LetModule } from '@ngrx/component';
import { MessageService } from '@eternal/shared/ui-messaging';

@Component({
  selector: 'eternal-edit-holiday',
  template:
    '<eternal-holiday-detail *ngrxLet="holiday$ as holiday" [holiday]="holiday" (remove)="handleRemove()" (save)="handleSave($event)"></eternal-holiday-detail>',
  standalone: true,
  imports: [HolidayDetailComponent, LetModule],
})
export class EditHolidayComponent implements OnInit {
  protected holiday$: Observable<Holiday> | undefined;
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #holidaysRepository = inject(HolidaysRepository);
  #holidayId = 0;
  #messageService = inject(MessageService);

  ngOnInit(): void {
    this.#holidayId = Number(this.#route.snapshot.paramMap.get('id'));
    this.holiday$ = this.#holidaysRepository
      .findById(this.#holidayId)
      .pipe(filterDefined);
  }

  handleRemove() {
    this.#holidaysRepository.remove(this.#holidayId);
    this.#messageService.info('Holiday was removed');
    this.#router.navigate(['..'], { relativeTo: this.#route });
  }

  handleSave(holiday: Holiday) {
    this.#holidaysRepository.save({ ...holiday, id: this.#holidayId });
    this.#messageService.info('Holiday was saved');
    this.#router.navigate(['..'], { relativeTo: this.#route });
  }
}
