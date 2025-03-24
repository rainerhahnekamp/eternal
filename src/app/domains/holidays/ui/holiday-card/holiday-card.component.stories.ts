import { HolidayCardComponent } from './holiday-card.component';

import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { createHoliday } from '../../model/holiday';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

const meta: Meta<HolidayCardComponent> = {
  title: 'Holiday Card Component',
  component: HolidayCardComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideNoopAnimations(),
        provideRouter([]),
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj<HolidayCardComponent>;

export const Primary: Story = {
  args: {
    holiday: {
      ...createHoliday({
        title: 'Welcome',
        description: 'Welcome to the Angular Testing Workshop',
        imageUrl: 'vienna.jpg',
      }),
      isFavourite: false,
    },
  },
};

export const OnSale: Story = {
  args: {
    holiday: {
      ...createHoliday({
        title: 'Welcome',
        description: 'Welcome to the Angular Testing Workshop',
        imageUrl: 'vienna.jpg',
        onSale: true,
      }),
      isFavourite: false,
    },
  },
};
