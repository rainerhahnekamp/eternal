import {
  Component,
  computed,
  effect,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

type Product = {
  id: number;
  name: string;
  price: number;
  amount: number;
};

@Injectable({ providedIn: 'root' })
export class SyncService {
  sync(products: Product[]) {
    console.log(products);
  }
}

@Injectable({ providedIn: 'root' })
export class BasketService {
  products = signal([
    {
      id: 1,
      name: 'Coffee',
      price: 3,
      amount: 1,
    },
    { id: 2, name: 'Schnitzel', price: 15, amount: 1 },
  ]);

  syncService = inject(SyncService);

  constructor() {
    effect(() => this.syncService.sync(this.products()));
  }

  totalPrice = computed(() =>
    this.products().reduce(
      (total, product) => total + product.price * product.amount,
      0,
    ),
  );

  decrease(id: number) {
    this.#change(id, (product) =>
      product.amount > 0 ? { ...product, amount: product.amount - 1 } : product,
    );
  }

  increase(id: number) {
    this.#change(id, (product) => ({ ...product, amount: product.amount + 1 }));
  }

  #change(id: number, callback: (product: Product) => Product) {
    this.products.update((products) =>
      products.map((product) => {
        if (product.id === id && product.amount > 0) {
          return callback(product);
        } else {
          return product;
        }
      }),
    );
  }
}

@Component({
  selector: 'app-basket',
  template: `<h2>Basket</h2>
    <div class="w-[640px]">
      <div class="grid grid-cols-4 gap-4 auto-cols-fr">
        <div class="font-bold">Name</div>
        <div class="font-bold">Price</div>
        <div class="font-bold">Amount</div>
        <div>&nbsp;</div>
        @for (product of products(); track product.id) {
          <div>{{ product.name }}</div>
          <div>{{ product.price }}</div>
          <div>{{ product.amount }}</div>
          <div>
            <button
              mat-raised-button
              (click)="decrease(product.id)"
              data-testid="btn-decrease"
            >
              <mat-icon>remove</mat-icon>
            </button>
            <button
              mat-raised-button
              (click)="increase(product.id)"
              data-testid="btn-increase"
            >
              <mat-icon>add</mat-icon>
            </button>
          </div>
        }

        <div class="font-bold">Total</div>
        <div class="font-bold" data-testid="total">{{ totalPrice() }}</div>
      </div>
    </div>`,
  standalone: true,
  imports: [MatButton, MatIcon],
})
export class BasketComponent {
  basketService = inject(BasketService);

  products = this.basketService.products;
  totalPrice = this.basketService.totalPrice;

  decrease(id: number) {
    this.basketService.decrease(id);
  }

  increase(id: number) {
    this.basketService.increase(id);
  }
}
