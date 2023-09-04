import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Holiday } from '@app/admin/holidays/model';
import { NgIf } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormErrorsComponent } from '@app/shared';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-holiday-detail',
  templateUrl: 'holiday-detail.component.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    RouterLinkWithHref,
    MatButtonModule,
    FormErrorsComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class HolidayDetailComponent {
  @ViewChild(NgForm) ngForm: NgForm | undefined;

  @Input() holiday: Holiday = { id: 0, name: '', description: '', trips: [] };

  @Output() save = new EventEmitter<Holiday>();
  @Output() remove = new EventEmitter<Holiday>();

  submit() {
    if (this.ngForm?.valid) {
      this.save.emit(this.holiday);
    }
  }

  handleRemove() {
    if (this.holiday && confirm(`Really delete ${this.holiday.name}?`)) {
      this.remove.emit(this.holiday);
    }
  }
}
