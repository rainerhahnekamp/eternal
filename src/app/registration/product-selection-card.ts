import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ProductGroup } from './registration-store';

@Component({
  selector: 'app-product-selection-card',
  template: `
    <mat-card
      [class]="{
        'border-2 border-primary bg-primary-50': isSelected(),
        'cursor-pointer': true,
      }"
      class="flex-1 transition-all hover:shadow-lg"
      (click)="value.set(productGroup())"
    >
      <mat-card-header>
        <div class="flex items-center justify-between w-full">
          <div>
            <mat-card-title>{{ title() }}</mat-card-title>
            <mat-card-subtitle>{{ subtitle() }}</mat-card-subtitle>
          </div>
          @if (isSelected()) {
            <mat-icon class="text-primary">check_circle</mat-icon>
          }
        </div>
      </mat-card-header>
      <mat-card-content>
        <ng-content />
      </mat-card-content>
    </mat-card>
  `,
  imports: [MatCardModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSelectionCard implements FormValueControl<ProductGroup> {
  public readonly value = model.required<ProductGroup>();
  public readonly productGroup = input.required<ProductGroup>();
  public readonly title = input.required<string>();
  public readonly subtitle = input.required<string>();

  protected readonly isSelected = computed(
    () => this.value() === this.productGroup(),
  );
}
