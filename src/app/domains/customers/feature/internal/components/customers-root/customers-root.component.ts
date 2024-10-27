import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customers-root',
  templateUrl: './customers-root.component.html',
  standalone: true,
  imports: [RouterOutlet],
})
export class CustomersRootComponent {}
