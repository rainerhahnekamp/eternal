import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: `
    <p>Do you give your consent that we can collect all your data?</p>
    <button mat-raised-button (click)="consent()">Of Course</button>&nbsp;
    <button mat-raised-button (click)="consent()">Do It</button>
  `
})
export class GdpcComponent {
  public constructor(private router: Router) {}

  consent(): void {
    this.router.navigateByUrl('/home');
  }
}
