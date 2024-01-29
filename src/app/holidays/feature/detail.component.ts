import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-detail',
  template: `<p>Current Id: {{ id() }}</p>`,
  standalone: true,
})
export class DetailComponent {
  id = signal(0);

  constructor() {
    inject(ActivatedRoute)
      .paramMap.pipe(takeUntilDestroyed())
      .subscribe((paramMap) => this.id.set(Number(paramMap.get('id') || '0')));
  }
}

