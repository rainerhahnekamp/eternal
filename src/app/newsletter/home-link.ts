import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home-link',
  template: `
    <a routerLink="/">Home</a>
  `,
  imports: [RouterLink],
})
export class HomeLinkComponent {
}