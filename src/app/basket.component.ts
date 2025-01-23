import {
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
  untracked,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

const products = [
  {
    id: 1,
    name: 'Apple',
  },
  {
    id: 2,
    name: 'Banana',
  },
  {
    id: 3,
    name: 'Orange',
  },
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
      <p>Amount: {{ amount() }}</p>
      <div class="flex gap-x-4">
        <input [(ngModel)]="amount" name="amount" type="number" />
        <button mat-raised-button (click)="updateAmount()">
          Update Amount
        </button>
      </div>
    }
  `,
  standalone: true,
  imports: [FormsModule, MatButton, MatButton],
})
export default class BasketComponent {
  readonly #httpClient = inject(HttpClient);

  protected readonly products = products;
  protected readonly selectedProductId = signal(0);
  protected readonly selectedProduct = computed(() =>
    products.find((p) => p.id === this.selectedProductId()),
  );

  protected readonly amount = linkedSignal(() => {
    this.selectedProductId();
    return 1;
  });

  _resetAmount = effect(() => {
    this.selectedProduct();

    untracked(() => {
      this.amount.set(1);
    });
  });

  selectProduct(id: number) {
    this.selectedProductId.set(id);
    console.log(this.selectedProduct()?.name + ' added to basket');
    this.#httpClient
      .post('/basket', {
        id: this.selectedProductId(),
        amount: this.amount(),
      })
      .subscribe();
  }

  updateAmount() {
    this.#httpClient
      .post('/basket', { id: this.selectedProductId(), amount: this.amount() })
      .subscribe();
  }
}
