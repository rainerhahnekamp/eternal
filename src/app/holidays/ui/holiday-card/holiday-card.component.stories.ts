import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { ActivatedRoute } from '@angular/router';
import { HolidayCardComponent } from '@app/holidays/ui';
import { createHoliday } from '@app/holidays/model';

const meta: Meta<HolidayCardComponent> = {
  title: 'Holiday Card',
  component: HolidayCardComponent,
  decorators: [
    moduleMetadata({
      providers: [{ provide: ActivatedRoute, useValue: undefined }],
    }),
  ],
};

export default meta;
type Story = StoryObj<HolidayCardComponent>;

export const DefaultLook: Story = {
  render: () => ({
    props: {
      holiday: createHoliday({ imageUrl: 'vienna.jpg' }),
    },
  }),
};

export const FavouriteLook: Story = {
  render: () => ({
    props: {
      holiday: {
        ...createHoliday({ imageUrl: 'vienna.jpg' }),
        isFavourite: true,
      },
    },
  }),
};
