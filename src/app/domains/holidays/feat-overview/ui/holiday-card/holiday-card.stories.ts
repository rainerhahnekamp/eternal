import { HolidayCard } from './holiday-card';

import { Meta, StoryObj } from '@storybook/angular/';
import { createHoliday } from '../../../model/holiday';
import { provideLocationMocks } from '@angular/common/testing';
import { applicationConfig } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

const meta: Meta<HolidayCard> = {
  title: 'Holiday Card Component',
  component: HolidayCard,
  decorators: [
    applicationConfig({
      providers: [
        provideZonelessChangeDetection(),
        provideLocationMocks(),
        provideRouter([]),
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj<HolidayCard>;

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
