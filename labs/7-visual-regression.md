- [1: HolidayCard in Storybook](#1-holidaycard-in-storybook)
- [2: HolidayCard Variations](#2-holidaycard-variations)
- [3: Visual Regression with Storybook](#3-visual-regression-with-storybook)
- [4: Bonus - Visual Regression with Cypress](#4-bonus---visual-regression-with-cypress)

# 1: HolidayCard in Storybook

1. Start Storybook via `npm run storybook`

2. Open `http://localhost:4400` and verify that Storybook shows up with a rendered HolidayCard

3. Open **/src/app/holidays/holiday-card/holiday-card.component.stories.ts** and change the values of the properties `title`, `description`, `imageUrl` to:

```json
{
  "title": "Angkor Wat",
  "description": "Explore the ancient temples in Cambodia",
  "imageUrl": "https://eternal-app.s3.eu-central-1.amazonaws.com/assets/AngkorWatSmall.jpg"
}
```

4. Verify that the new values are shown in Storybook.

# 2: HolidayCard Variations

1. In **/src/app/holidays/holiday-card/holiday-card.component.stories.ts**, create a factory method along default values for the story:

```typescript
const defaultHoliday: Holiday = {
  id: 1,
  title: 'Wien / Vienna',
  teaser: 'Dive into the capital of the Habsburg empire',
  imageUrl: 'vienna.jpg',
  description: 'With a population of almost 2 million, Vienna is the second largest German-speaking city and breathes history in every corner.',
  typeId: 1,
  durationInDays: 7,
  minCount: 5,
  maxCount: 15,
  onSale: false,
  soldOut: false,
};

function createStory(holiday: Partial<Holiday> = {}) {
  return () => ({ props: { holiday: { ...defaultHoliday, ...holiday } } });
}
```

2. Let's use the `createStory` method to generate HolidayCard variations

```typescript
export const Minimal = createStory({
  title: 'Wien',
  teaser: 'Teaser',
  description: 'Description',
});

export const Overflown = createStory({
  title: 'A very long city name which does not fit within a line',
  teaser: 'This is also a very long teaser text which surely does not fit within two lines. The 3rd line is hidden',
  description: 'Eventually also an extremly long description where we simply have to limit the amount of lines to a maximum of three. We are still continuing here with some further text.',
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
```

# 3: Visual Regression with Storybook

Write a VR test with Playwright for all HolidayCard stories

1. `npm run storybook:build`
2. `npm run storybook:build:run`

Storybook will run on port 5000.

# 4: Bonus - Visual Regression with Cypress

1. Setup the required plugin:

**apps/eternal-e2e/cypress.json**

Add the `cypress-plugin-snapshots` configuration to the `env` property.

```json
{
  "env": {
    ...
    "cypress-plugin-snapshots": {
      "imageConfig": {
        "threshold": 0
      }
    }
  }
}
```

**apps/eternal-e2e/tsconfig.e2e.json**

The property `compiler.types` should have the following value `"types": ["cypress", "node", "cypress-plugin-snapshots"]`.

**apps/eternal-e2e/src/support/index.js**

Append the following line

```javascript
import 'cypress-plugin-snapshots/commands';
```

**apps/eternal-e2e/src/plugins/index.js**

Replace the existing `module.exports` with

```javascript
const { initPlugin } = require('cypress-plugin-snapshots/plugin');
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  initPlugin(on, config);
};
```

2. Write the test

<details>
<summary>Show Solution</summary>
<p>

**apps/eternal-e2e/src/integration/holiday-card.spec.ts**

```typescript
it('should do visual regression against the holidaycard', () => {
  cy.visit('http://localhost:4400/iframe?id=eternal-holidaycard--default&viewMode=story');
  cy.document().toMatchImageSnapshot();
});
```

</p>
</details>
