import { HolidayCardComponent } from './holiday-card.component';

import { Meta, moduleMetadata, StoryObj } from '@storybook/angular/';
import { createHoliday, Holiday } from '../../model/holiday';
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
  args: {
    holiday: {
      ...createHoliday({
        title: 'Welcome',
        description: 'Welcome to the Angular Testing Workshop',
        imageUrl:
          'https://eternal-app.s3.eu-central-1.amazonaws.com/assets/AngkorWatSmall.jpg',
      }),
      isFavourite: false,
    },
  },
};

const createStory = (
  holiday: Partial<Holiday & { isFavourite: boolean }> = {},
): Story => ({
  args: {
    holiday: {
      ...createHoliday(),
      isFavourite: true,
      imageUrl: 'vienna.jpg',
      ...holiday,
    },
  },
});

export const Minimal = createStory({
  title: 'Wien',
  teaser: 'Teaser',
  description: 'Description',
});

export const Overflown = createStory({
  title: 'A very long city name which does not fit within a line',
  teaser:
    'This is also a very long teaser text which surely does not fit within two lines. The 3rd line is hidden',
  description:
    'Eventually also an extremely long description where we simply have to limit the amount of lines to a maximum of three. We are still continuing here with some further text.',
});

export const SoldOut = createStory({ soldOut: true });

export const Empty = createStory({
  title: '',
  teaser: '',
  description: '',
  imageUrl: '',
});

export const TinyImage = createStory({
  imageUrl: 'vienna-small.jpg',
});

export const OnSale = createStory({ onSale: true });

export const SaleAndSold = createStory({ onSale: true, soldOut: true });
