import { HolidayCardComponent } from './holiday-card.component';

import { Meta, moduleMetadata, StoryObj } from '@storybook/angular/';
import { createHoliday } from '../../model/holiday';
import { provideLocationMocks } from '@angular/common/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

const meta: Meta<HolidayCardComponent> = {
  title: 'Holiday Card Component',
  component: HolidayCardComponent,
  decorators: [
    moduleMetadata({
      providers: [provideNoopAnimations(), provideLocationMocks()],
      imports: [RouterTestingModule],
    }),
  ],
};

export default meta;

type Story = StoryObj<HolidayCardComponent>;

export const Primary: Story = {
  render: () => ({
    props: {
      holiday: {
        ...createHoliday({
          title: 'Welcome',
          description: 'Welcome to the Angular Testing Workshop',
          imageUrl: 'vienna.jpg',
        }),
        isFavourite: false,
      },
    },
  }),
};

export const OnSale: Story = {
  render: () => ({
    props: {
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
  }),
};

export const SoldOut: Story = {
  render: () => ({
    props: {
      holiday: {
        ...createHoliday({
          title: 'Welcome',
          description: 'Welcome to the Angular Testing Workshop',
          imageUrl: 'vienna.jpg',
          soldOut: true,
        }),
        isFavourite: false,
      },
    },
  }),
};

export const Favourite: Story = {
  render: () => ({
    props: {
      holiday: {
        ...createHoliday({
          title: 'Welcome',
          description: 'Welcome to the Angular Testing Workshop',
          imageUrl: 'vienna.jpg',
        }),
        isFavourite: true,
      },
    },
  }),
};
