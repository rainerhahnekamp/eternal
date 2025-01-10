import { Component } from '@angular/core';
import {
  MatDrawerContainer,
  MatDrawerContent,
} from '@angular/material/sidenav';
import { RouterLinkWithHref, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  template: ` <div class="main flex">
    <a routerLink="/quiz" mat-raised-button>Quiz</a>
    <a routerLink="/booking" mat-raised-button>Booking</a>
    <mat-drawer-container autosize>
      <mat-drawer-content class="p-4">
        <router-outlet />
      </mat-drawer-content>
    </mat-drawer-container>
  </div>`,
  styleUrls: ['./app.component.scss'],
  imports: [MatDrawerContainer, MatDrawerContent, RouterLinkWithHref, RouterOutlet],
})
export class AppComponent {}
