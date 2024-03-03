import { Injectable } from '@angular/core';
import { Product } from '@app/basket/product';

@Injectable({ providedIn: 'root' })
export class SyncService {
  sync(products: Product[]) {
    console.log(products);
  }
}
