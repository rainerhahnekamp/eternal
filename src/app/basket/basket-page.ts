import {
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../shared/ui-messaging/message/message.service';

const products = [
  { id: 1, name: 'Apple', price: 1.5 },
  { id: 2, name: 'Banana', price: 2 },
  { id: 3, name: 'Orange', price: 5 },
];

@Component({
  selector: 'app-basket',
  template: `
    <h3>Click on a product to add it to the basket</h3>

    <div class="flex gap-4 my-8">
      @for (product of products; track product) {
        <button mat-raised-button (click)="selectProduct(product.id)">
          {{ product.name }}
        </button>
      }
    </div>

    @if (selectedProduct(); as product) {
      <p>Selected Product: {{ product.name }}</p>
      <p>Want more? Top up the amount</p>
      <div class="flex gap-x-4">
        <input [(ngModel)]="amount" name="amount" type="number" />
        <button mat-raised-button (click)="updateAmount()">
          Update Amount
        </button>
      </div>
    }
  `,
  standalone: true,
  imports: [FormsModule, MatButton],
})
export default class BasketPage {
  protected readonly selectedProductId = signal(0);
  amount = signal(1);

  constructor() {
    effect(
      () => {
        this.selectedProductId();
        untracked(() => this.amount.set(1));
      },
      { debugName: 'resetEffect' },
    );
  }

  readonly #messageService = inject(MessageService);
  readonly #httpClient = inject(HttpClient);
  protected readonly products = products;

  protected readonly selectedProduct = computed(() =>
    products.find((p) => p.id === this.selectedProductId()),
  );

  selectProduct(id: number) {
    this.selectedProductId.set(id);
    this.#messageService.info(
      this.selectedProduct()?.name + ' added to basket',
    );
    this.#httpClient
      .post('/basket', { id: this.selectedProductId(), amount: this.amount() })
      .subscribe();
  }

  updateAmount() {
    this.#httpClient
      .post('/basket', { id: this.selectedProductId(), amount: this.amount() })
      .subscribe();
  }
}
