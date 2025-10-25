import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-link',
  template: `<a routerLink="/home">Home</a>`,
  imports: [RouterLink],
})
export class HomeLink {}
