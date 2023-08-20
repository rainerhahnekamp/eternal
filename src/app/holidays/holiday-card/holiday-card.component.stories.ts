import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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
      imports: [MatButtonModule, MatCardModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<HolidayCardComponent>;

const defaultHoliday: Holiday = {
  id: 1,
  title: 'Vienna',
  description: 'Holiday in Vienna',
  imageUrl: 'vienna.jpg',
  teaser: '',
  minCount: 8,
  maxCount: 17,
  typeId: 1,
  durationInDays: 10,
  soldOut: false,
  onSale: false,
};

const createStory = (
  holiday: Partial<Holiday> = {},
  name?: string,
): StoryObj<HolidayCardComponent> => ({
  name,
  render: () => ({ props: { holiday: { ...defaultHoliday, ...holiday } } }),
});

export const Default = createStory({}, 'Vienna');
export const Empty = createStory({ title: '', description: '' }, 'Vienna');
