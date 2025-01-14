import { Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CustomersStore } from '@app/customers/data';
import { MessageService } from '@app/shared/ui-messaging';

@Component({
  selector: 'app-customers-root',
  templateUrl: './customers-root.component.html',
  imports: [RouterOutlet],
})
export class CustomersRootComponent {
  readonly #customersStore = inject(CustomersStore);

  constructor(router: Router, messageService: MessageService) {
    effect(() => {
      const hasError = this.#customersStore.hasError();
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
