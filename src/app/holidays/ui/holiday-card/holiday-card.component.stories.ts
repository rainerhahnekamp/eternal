import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HolidayCardComponent } from './holiday-card.component';
import { ActivatedRoute } from '@angular/router';
import { Holiday } from '@app/holidays/model';

const meta: Meta<HolidayCardComponent> = {
  title: 'Eternal/Holiday Card',
  component: HolidayCardComponent,
  decorators: [
    moduleMetadata({
      providers: [{ provide: ActivatedRoute, useValue: undefined }],
    }),
  ],
};

export default meta;
type Story = StoryObj<HolidayCardComponent>;

export const AngkorWat: Story = {
  name: 'Angkor Wat',
  render() {
    return {
      props: {
        holiday: {
          id: 1,
          title: 'Angkor Wat',
          description: 'Discover the temples of the Khmer empire',
          imageUrl:
            'https://eternal-app.s3.eu-central-1.amazonaws.com/assets/AngkorWatSmall.jpg',
          teaser: '',
          minCount: 8,
          maxCount: 17,
          typeId: 1,
          durationInDays: 10,
          soldOut: false,
          onSale: false,
        },
      },
    };
  },
};

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
};

const createStory = (
  holiday: Partial<Holiday> = {},
  name?: string,
): StoryObj<HolidayCardComponent> => ({
  name,
  render: () => ({ props: { holiday: { ...defaultHoliday, ...holiday } } }),
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
