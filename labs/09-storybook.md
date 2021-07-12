- [1. Adding HolidayCard to Storybook](#1-adding-holidaycard-to-storybook)
- [2. Add RequestInfo Story](#2-add-requestinfo-story)
- [3. Bonus: Snapshot all Stories](#3-bonus-snapshot-all-stories)
- [4. Bonus: Holiday Card with Controls](#4-bonus-holiday-card-with-controls)

In this lab, we are going to improve the display of our holiday offers. To make them better "storybookable", we need to stick to the container / presentation strategy.

So let's first create a presentation component that represents a holiday card.

# 1. Adding HolidayCard to Storybook

1. Create the stories file.

**holidays/holiday-card.component.stories.ts**

```typescript
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
    typeId: 1,
    title: 'Holiday',
    description: 'A holiday',
    imageUrl: 'https://eternal-app.s3.eu-central-1.amazonaws.com/assets/AngkorWatSmall.jpg',
    teaser: 'Very good!',
    minCount: 8,
    maxCount: 15,
    durationInDays: 10
  }
};
```

# 2. Add RequestInfo Story

Create the for the RequestInfo component on your own. Since it does not have any `@Input`, the code should be much shorter.

<details>
<summary>Show Solution</summary>
<p>

**holidays/request-info/request-info.component.stories.ts**

```typescript
export default {
  title: 'Eternal/RequestInfo',
  component: RequestInfoComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule
      ]
    })
  ]
} as Meta;

const Template: Story<RequestInfoComponent> = (args: RequestInfoComponent) => ({
  component: RequestInfoComponent,
  props: args
});

export const Normal = Template.bind({});
```

**../../.storybook/preview-head.html**

```html
<link
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap"
  rel="stylesheet"
/>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
<style>
  div#root {
    background: white;
    padding: 2em;
  }
</style>
```

</p>
</details>

# 3. Bonus: Snapshot all Stories

We can now snapshot all our stories via Puppeteer with one single test:

**/src/stories/storyshot.spec.js**

```typescript
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';

initStoryshots({ suite: 'Image storyshots', test: imageSnapshot() });
```

# 4. Bonus: Holiday Card with Controls

This is a variation of the holiday card where we provide controls so that the user could change the values:

**holidays/holiday-card.component.custom.stories.ts**

```typescript
const urls = [
  'https://eternal-app.s3.eu-central-1.amazonaws.com/assets/AngkorWatSmall.jpg',
  'https://eternal-app.s3.eu-central-1.amazonaws.com/assets/AustrianRushSmall.jpg',
  'https://eternal-app.s3.eu-central-1.amazonaws.com/assets/ChinaSmall.jpg'
];

export default {
  title: 'Eternal/Customisable HolidayCard',
  component: HolidayCardComponent,
  decorators: [moduleMetadata({ imports: [MatButtonModule, MatCardModule, RouterTestingModule] })],
  argTypes: {
    title: { control: 'text', defaultValue: 'THE eternal Holiday' },
    description: { control: 'text', defaultValue: 'Very nice Holiday' },
    teaser: { control: 'text', defaultValue: 'Buy it' },
    imageUrl: {
      control: {
        type: 'select',
        options: urls
      },
      defaultValue: urls[0]
    },
    holiday: {
      table: {
        disable: true
      }
    }
  }
} as Meta;

type HolidayCardArgs = HolidayCardComponent & {
  title: string;
  description: string;
  teaser: string;
  imageUrl: string;
};

const Template: Story<HolidayCardComponent> = (args: HolidayCardArgs) => {
  return {
    component: HolidayCardComponent,
    props: {
      ...args,
      holiday: {
        title: args.title,
        description: args.description,
        teaser: args.teaser,
        imageUrl: args.imageUrl
      }
    }
  };
};

export const Holiday = Template.bind({});
```
