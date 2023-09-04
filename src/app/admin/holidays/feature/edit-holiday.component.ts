import { Component, inject } from '@angular/core';
import { HolidaysRepository } from '@app/admin/holidays/data';
import { ActivatedRoute, Router } from '@angular/router';
import { Holiday } from '@app/admin/holidays/model';
import { filterDefined } from '@app/shared/ngrx-utils';
import { HolidayDetailComponent } from '@app/admin/holidays/ui';
import { LetDirective } from '@ngrx/component';
import { MessageService } from '@app/shared/ui-messaging';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-holiday',
  template:
    '<app-holiday-detail *ngrxLet="holiday$ as holiday" [holiday]="holiday" (remove)="handleRemove()" (save)="handleSave($event)"></app-holiday-detail>',
  standalone: true,
  imports: [HolidayDetailComponent, LetDirective],
})
export class EditHolidayComponent {
  #id = 0;
  #holidaysRepository = inject(HolidaysRepository);
  protected holiday$ = inject(ActivatedRoute).paramMap.pipe(
    map((paramMap) => paramMap.get('id')),
    filterDefined,
    switchMap((value) => {
      const id = Number(value);
      this.#id = id;
      return this.#holidaysRepository.findById(Number(id));
    }),
    filterDefined,
  );
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #messageService = inject(MessageService);

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
