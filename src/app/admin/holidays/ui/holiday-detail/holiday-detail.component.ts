import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormErrorsComponent } from '@app/shared/form';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export type HolidayFormInput = {
  name: string;
  description: string;
  hasCover: boolean;
  coverLink: string;
};

export type HolidayForm = HolidayFormInput & {
  cover: File;
};

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
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;

  @Input() holiday: HolidayFormInput | undefined;

  @Output() save = new EventEmitter<HolidayForm>();
  @Output() remove = new EventEmitter<void>();
  cover: File | undefined;
  imageSrc = '';

  submit() {
    if (this.ngForm?.valid && this.holiday && this.cover) {
      this.save.emit({ ...this.holiday, cover: this.cover });
    }
  }

  handleRemove() {
    if (this.holiday && confirm(`Really delete ${this.holiday.name}?`)) {
      this.remove.emit();
    }
  }

  onFileSelected() {
    const input = this.fileInput?.nativeElement;

    if (input?.files && typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          this.imageSrc = reader.result;
        }
      };

      this.cover = input.files[0];
      reader.readAsDataURL(this.cover);
    }
  }
}
