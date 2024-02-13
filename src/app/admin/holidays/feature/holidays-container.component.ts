import { Component, computed, inject } from '@angular/core';
import { HolidaysRepository } from '@app/admin/holidays/data';
import { HolidaysComponent } from '@app/admin/holidays/ui';

@Component({
  selector: 'app-holidays-container',
  template: `@if (viewModel(); as viewModel) {
    <app-holidays [viewModel]="viewModel" />
  }`,
  standalone: true,
  imports: [HolidaysComponent],
})
export class HolidaysContainerComponent {
  #repository = inject(HolidaysRepository);

  protected viewModel = computed(() => {
    const holidays = this.#repository.holidays();
    return {
      holidays,
      pageIndex: 0,
      length: holidays.length,
    };
  });
}
