import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { ActivatedRoute } from '@angular/router';
import { HolidayCardComponent } from './holiday-card.component';
import { createHoliday } from '@app/holidays/model';

const meta: Meta<HolidayCardComponent> = {
  title: 'Isolated Component',
  component: HolidayCardComponent,
  decorators: [
    moduleMetadata({
      providers: [{ provide: ActivatedRoute, useValue: undefined }],
    }),
  ],
};

export default meta;
type Story = StoryObj<HolidayCardComponent>;

export const Favourite: Story = {
  render: () => ({
    props: {
      holiday: {
        ...createHoliday({ imageUrl: 'vienna.jpg' }),
        isFavourite: true,
      },
    },
  }),
};
