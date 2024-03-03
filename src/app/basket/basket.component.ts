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
import { BasketService } from '@app/basket/basket.service';

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
export default class BasketComponent {
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
