import {
  ChangeDetectionStrategy,
  Component,
  input,
  linkedSignal,
  numberAttribute,
} from '@angular/core';
import { Markdown } from './markdown';
import { httpResource } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Timer } from './timer';

@Component({
  template: `<h2>Edit Holiday</h2>
    <div class="my-4"><app-timer /></div>
    <div class="flex gap-x-4">
      <div class="flex-1">
        <textarea class="w-full h-96" [(ngModel)]="markdownValue"></textarea>
      </div>
      <div class="flex-1 h-96">
        <app-markdown [markdown]="markdownValue()" />
      </div>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Markdown, FormsModule, Timer],
})
export class EditHolidayPage {
  readonly id = input.required({ transform: numberAttribute });

  protected readonly markdown = httpResource.text(
    () => 'http://localhost:4200/assets/mainz.md',
    {
      defaultValue: '',
      parse: (value) => {
        return String(value);
      },
    },
  );

  protected readonly markdownValue = linkedSignal(this.markdown.value);
}
