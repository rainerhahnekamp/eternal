import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { HolidayCardComponent } from './holiday-card.component';

export default {
  title: 'Eternal/HolidayCard',
  component: HolidayCardComponent,
  decorators: [moduleMetadata({ imports: [MatButtonModule, MatCardModule, RouterTestingModule] })],
  argTypes: {
    holiday: {
      name: 'Holiday',
      description: 'JSON object for the Holiday'
    }
  }
} as Meta;

const Template: Story<HolidayCardComponent> = (args: HolidayCardComponent) => {
  return {
    component: HolidayCardComponent,
    props: args
  };
};

export const Default = Template.bind({});
Default.args = {
  holiday: {
    id: 1,
    title: 'Welcome',
    description: 'Welcome to the Angular Testing Workshop',
    imageUrl: 'https://avatars.githubusercontent.com/u/61938637?s=200&v=4',
    teaser: '',
    minCount: 8,
    maxCount: 17,
    typeId: 1,
    durationInDays: 10
  }
};
