import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customers-root',
  template: `<router-outlet />`,
  imports: [RouterOutlet],
})
export class CustomersRootPage {}
