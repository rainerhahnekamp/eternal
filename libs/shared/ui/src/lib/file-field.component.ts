import { FieldType } from '@ngx-formly/material';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'formly-field-file',
  template: `
    <button type="button" mat-raised-button (click)="fileInput.click()">
      Select Cover Image
    </button>
    <input
      hidden
      (change)="onFileSelected()"
      #fileInput
      type="file"
      id="file"
    />
    <div class="mt-4 text-center" *ngIf="imageSrc">
      <img [src]="imageSrc" alt="Cover Image" />
    </div>
  `,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormlyModule,
    MatInputModule,
    MatButtonModule,
    NgIf,
  ],
})
export class FileField extends FieldType<any> {
  cdr = inject(ChangeDetectorRef);
  imageSrc = '';
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;

  onFileSelected() {
    const input = this.fileInput?.nativeElement;

    if (input?.files && typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          this.imageSrc = reader.result;
          this.cdr.detectChanges();
        }
      };

      const coverImage = input.files[0];
      this.formControl.setValue(coverImage);

      reader.readAsDataURL(coverImage);
    }
  }
}
