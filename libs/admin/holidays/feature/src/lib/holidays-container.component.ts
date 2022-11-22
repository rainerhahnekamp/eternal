import { Component, inject } from '@angular/core';
import { HolidaysRepository } from '@eternal/admin/holidays/data';
import { HolidaysComponent } from '@eternal/admin/holidays/ui';
import { LetModule } from '@ngrx/component';
import { map } from 'rxjs';

@Component({
  selector: 'eternal-holidays-container',
  template:
    '<eternal-holidays *ngrxLet="viewModel$ as viewModel" [viewModel]="viewModel"></eternal-holidays>',
  standalone: true,
  imports: [HolidaysComponent, LetModule],
})
export class HolidaysContainerComponent {
  #repository = inject(HolidaysRepository);

  protected viewModel$ = this.#repository.holidays$.pipe(
    map((holidays) => ({ holidays, pageIndex: 0, length: holidays.length }))
  );
}
