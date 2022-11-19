import { inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CustomersRepository } from '@eternal/customers/data';

@Injectable({
  providedIn: 'root',
})
export class DataGuard implements CanActivate {
  #customersRepository = inject(CustomersRepository);

  canActivate(): boolean {
    this.#customersRepository.init();
    return true;
  }
}
