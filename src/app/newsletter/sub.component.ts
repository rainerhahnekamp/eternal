import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-sub-newsletter',
  template: `<a routerLink="/">Home</a>`,
  standalone: true,
  imports: [RouterLink],
})
export class SubComponent {}
