import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class TestService {
  isFormValid = signal(false);
  message = computed(() => {
    return this.isFormValid() ? 'Form is valid' : 'Form is invalid';
  });

  value = signal(0);

  increment(m = 1) {
    this.value.set(m);
  }

  counter = signal(0);

  constructor() {
    effect(() => {
      const n = this.value();
      this.counter.update((value) => value + n);
    });
  }

  formGroup = inject(NonNullableFormBuilder).group({
    email: ['', Validators.required],
  });

  handleSubmit() {
    this.isFormValid.set(this.formGroup.valid);
  }
}
