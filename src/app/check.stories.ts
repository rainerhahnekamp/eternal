import { MatButtonModule } from '@angular/material/button';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  template: `<h1>Checker Component</h1>
    <button mat-raised-button>Welcome to the Workshop</button>
    <img
      ngSrc="/AngkorWat.jpg"
      alt="Angkor Wat"
      width="200"
      height="200"
      [title]="title"
    />`,
  standalone: true,
  imports: [MatButtonModule, NgOptimizedImage],
})
export class CheckComponent {
  @Input() title = '';
}

const meta: Meta<CheckComponent> = {
  title: 'Eternal/Checker',
  component: CheckComponent,
  decorators: [
    moduleMetadata({

    }),
  ],
};

export default meta;

export const Check: StoryObj<CheckComponent> = {
  render: () => ({ props: {} }),
};
