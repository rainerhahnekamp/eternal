import { HolidayCardComponent } from './holiday-card.component';

import { Meta, moduleMetadata, StoryObj } from '@storybook/angular/';
import { Holiday } from '../../model/holiday';
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

const defaultHoliday: Holiday = {
  id: 1,
  title: 'Wien / Vienna',
  teaser: 'Dive into the capital of the Habsburg empire',
  imageUrl: 'vienna.jpg',
  description:
    'With a population of almost 2 million, Vienna is the second largest German-speaking city and breathes history in every corner.',
  typeId: 1,
  durationInDays: 7,
  minCount: 5,
  maxCount: 15,
  onSale: false,
  soldOut: false,
  hasQuiz: false,
};

const createStory = (
  holiday: Partial<Holiday> = {},
  name?: string,
): StoryObj<HolidayCardComponent> => ({
  name,
  render: () => ({ props: { holiday: { ...defaultHoliday, ...holiday } } }),
});

export const Default = createStory();

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
