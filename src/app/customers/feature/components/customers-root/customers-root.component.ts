import { Component, effect } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CustomersRepository } from '@app/customers/data';
import { MessageService } from '@app/shared/ui-messaging';

@Component({
  selector: 'app-customers-root',
  templateUrl: './customers-root.component.html',
  standalone: true,
  imports: [RouterOutlet],
})
export class CustomersRootComponent {
  constructor(
    customersRepository: CustomersRepository,
    router: Router,
    messageService: MessageService,
  ) {
    effect(() => {
      const hasError = customersRepository.hasError();
      if (!hasError) {
        return;
      }

      router.navigateByUrl('/');
      messageService.confirm(
        'Sorry, but Customers are not available at the moment.<br>Please try again later.',
      );
    });
  }
}
