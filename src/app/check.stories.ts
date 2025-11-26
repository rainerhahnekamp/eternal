import {
  Component,
  computed,
  effect,
  Input,
  OnChanges,
  signal,
} from '@angular/core';
import { applicationConfig, Meta, StoryObj } from '@storybook/angular';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-slider',
  template: `<h2>Slider</h2>
    @if (image(); as value) {
      <div>
        <button mat-raised-button (click)="previous()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <button mat-raised-button (click)="next()">
          <mat-icon>arrow_forward</mat-icon>
        </button>
      </div>
      <div>
        <img [src]="value.url" alt="{{ value.name }}" />
      </div>
    }`,
  styles: [
    `
      img {
        max-width: 1024px;
      }
    `,
  ],
  imports: [MatButtonModule, MatIconModule],
})
export class SliderComponent implements OnChanges {
  @Input() images: { url: string; name: string }[] = [];
  private _images = signal<typeof this.images>([]);
  private ix = signal(0);
  image = computed(() => {
    const images = this._images();
    return images[this.ix()];
  });

  constructor() {
    effect(() => console.log(this.image()));
  }

  ngOnChanges(): void {
    this._images.set(this.images);
  }

  previous() {
    if (this.ix() === 0) {
      return;
    }
    this.ix.update((value) => value - 1);
  }
  next() {
    if (this.ix() === this._images().length - 1) {
      return;
    }
    this.ix.update((value) => value + 1);
  }
}

const meta: Meta<SliderComponent> = {
  title: 'Isolated Component',
  component: SliderComponent,
  decorators: [
    applicationConfig({
      providers: [{ provide: ActivatedRoute, useValue: undefined }],
    }),
  ],
};

export default meta;
type Story = StoryObj<SliderComponent>;

export const DefaultLook: Story = {
  render: () => ({
    props: {
      images: [
        { url: 'vienna.jpg', name: 'Vienna' },
        { url: 'london.jpg', name: 'London' },
      ],
    },
  }),
};
