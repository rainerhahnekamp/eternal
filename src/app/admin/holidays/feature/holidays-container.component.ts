import { Component, inject } from '@angular/core';
import { HolidaysRepository } from '@app/admin/holidays/data';
import { HolidaysComponent } from '@app/admin/holidays/ui';
import { LetDirective } from '@ngrx/component';
import { map } from 'rxjs';

@Component({
  selector: 'app-holidays-container',
  template:
    '<app-holidays *ngrxLet="viewModel$ as viewModel" [viewModel]="viewModel" />',
  standalone: true,
  imports: [HolidaysComponent, LetDirective],
})
export class HolidaysContainerComponent {
  #repository = inject(HolidaysRepository);

  protected viewModel$ = this.#repository.holidays$.pipe(
    map((holidays) => ({ holidays, pageIndex: 0, length: holidays.length })),
  );
}
