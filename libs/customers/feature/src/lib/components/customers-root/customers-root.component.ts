import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CustomersRepository } from '@eternal/customers/data';
import { MessageService } from '@eternal/shared/ui-messaging';
import { first } from 'rxjs';

@Component({
  templateUrl: './customers-root.component.html',
  standalone: true,
  imports: [RouterOutlet],
})
export class CustomersRootComponent {
  constructor(
    customersRepository: CustomersRepository,
    router: Router,
    messageService: MessageService
  ) {
    customersRepository.hasError$.pipe(first(Boolean)).subscribe(() => {
      router.navigateByUrl('/');
      messageService.confirm(
        'Sorry, but Customers are not available at the moment.<br>Please try again later.'
      );
    });
  }
}
