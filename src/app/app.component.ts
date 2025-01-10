import { Component } from '@angular/core';
import { QuizComponent } from './quiz/feature/quiz.component';
import {
  MatDrawerContainer,
  MatDrawerContent,
} from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  template: ` <div class="main flex">
    <mat-drawer-container autosize>
      <mat-drawer-content class="p-4">
        <app-quiz></app-quiz>
      </mat-drawer-content>
    </mat-drawer-container>
  </div>`,
  styleUrls: ['./app.component.scss'],
  imports: [QuizComponent, MatDrawerContainer, MatDrawerContent],
})
export class AppComponent {}
