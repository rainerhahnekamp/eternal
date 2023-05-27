import { Component, Injectable } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cookie-confirmer',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: ` <div>
    <h3>Do you allow us to store cookies?</h3>
    <div class="mat-dialog-actions">
      <button data-testid="cookie-confirm" mat-button mat-dialog-close="">Ok</button>
    </div>
  </div>`
})
export class CookieConfirmerDialogComponent {}

@Injectable()
export class CookieConfirmer {
  constructor(public dialog: MatDialog) {
    this.dialog.open(CookieConfirmerDialogComponent, { width: '250px' });
  }
}
