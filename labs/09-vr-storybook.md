- [1. Initial Setup](#1-initial-setup)
- [2. Screenshotting Home](#2-screenshotting-home)
- [3. HolidayCard in Storybook](#3-holidaycard-in-storybook)
- [4. HolidayCard Variations](#4-holidaycard-variations)
- [5. Visual Regression with Storybook](#5-visual-regression-with-storybook)
- [6. Add RequestInfoComponent to Storybook](#6-add-requestinfocomponent-to-storybook)
- [7. E2E RequestInfo in Cypress with Harness](#7-e2e-requestinfo-in-cypress-with-harness)
- [Bonus: Visual Regression with Cypress](#bonus-visual-regression-with-cypress)

# 1. Initial Setup

In order to make that work, we need have a dedicated jest configuration. Study following files:

1.  `jest.config-vr.js`
2.  `setup-jest-vr.ts`

# 2. Screenshotting Home

1. Screenshot home with a unit test. Create a new test file `home.component.spec-vr.ts`.

**home/home.component.spec-vr.ts**

```typescript
describe('Home', () => {
  it('should screenshot home', async () => {
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  });
});
```

2. Make sure the frontend is running in parallel, then run `npm run test:vr`.

3. Ensure that **home/** has a subfolder`_image_snapshots_`. It should contain the screenshot.

4. Open **home/home.component.css**, and add following styling: `p {font-family: Arial}`. Rerun the test. It should fail.

5. Make sure, you have now another subfolder called `_diff_output_`. It should contain the two images and also the diff image.

6. Revert your changes to **home/home.component.css** and make sure that the test turns green.

# 3. HolidayCard in Storybook

1. Start Storybook via `npm run storybook`

2. Open `http://localhost:4400` and verify that Storybook shows up with a rendered HolidayCard

3. Open **holidays/holiday-card/holiday-card.component.stories.ts** and change the values of the properties `title`, `description`, `imageUrl` to:

```json
{
  "title": "Angkor Wat",
  "description": "Explore the ancient temples in Cambodia",
  "imageUrl": "https://eternal-app.s3.eu-central-1.amazonaws.com/assets/AngkorWatSmall.jpg"
}
```

4. Verify that the new values are shown in Storybook.

# 4. HolidayCard Variations

1. In **holidays/holiday-card/holiday-card.component.stories.ts**, create a factory method along default values for the story:

```typescript
const defaultHoliday: Holiday = {
  id: 1,
  title: 'Wien / Vienna',
  teaser: 'Dive into the capital of the Habsburg empire',
  imageUrl: '/assets/vienna.jpg',
  description:
    'With a population of almost 2 million, Vienna is the second largest German-speaking city and breathes history in every corner.',
  typeId: 1,
  durationInDays: 7,
  minCount: 5,
  maxCount: 15,
  onSale: false,
  soldOut: false
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
  description: 'Description'
});

export const Overflown = createStory({
  title: 'A very long city name which does not fit within a line',
  teaser:
    'This is also a very long teaser text which surely does not fit within two lines. The 3rd line is hidden',
  description:
    'Eventually also an extremly long description where we simply have to limit the amount of lines to a maximum of three. We are still continuing here with some further text.'
});

export const SoldOut = createStory({ soldOut: true });

export const Empty = createStory({
  title: '',
  teaser: '',
  description: '',
  imageUrl: ''
});

export const TinyImage = createStory({
  imageUrl: '/assets/vienna-small.jpg'
});

export const OnSale = createStory({ onSale: true });

export const SaleAndSold = createStory({ onSale: true, soldOut: true });
```

# 5. Visual Regression with Storybook

Write a VR test that screenshots all HolidayCard variations from Storybook. This time though, run them against a builded Storybook instance. Run following commands sequentially:

1. `npm run storybook:build`
2. `npm run storybook:build:run`

Storybook will run on port 5000.

# 6. Add RequestInfoComponent to Storybook

Based on the HolidayCard, integrate the `RequestInfoComponent` into Storybook.

<details>
<summary>Show Solution</summary>
<p>

**/holidays/request-info/request-info.component.stories.ts**

```typescript
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata } from '@storybook/angular';
import { RequestInfoComponent } from './request-info.component';

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

export const Default = () => ({});
```

</p>
</details>

# 7. E2E RequestInfo in Cypress with Harness

Now all together. Write an E2E in Cypress, that tests the RequestInfo in Storybook and uses the `request-info.component.harness.ts`.

Verify also the case when an address is not found. Use `cy.intercept` for that.

<details>
<summary>Show Solution</summary>
<p>

**/apps/eternal-e2e/src/integration/request-info.component.spec.ts**

```typescript
import { getHarness } from '@jscutlery/cypress-harness';
import { RequestInfoComponentHarness } from '../../../eternal/src/app/holidays/request-info/request-info.component.harnes';

describe('Request Info', () => {
  beforeEach(() =>
    cy.visit('http://localhost:4400/iframe.html?id=eternal-requestinfo--default&viewMode=story')
  );

  it('should test a valid address', () => {
    const harness = getHarness(RequestInfoComponentHarness);
    harness.writeAddress('Domgasse 5');
    harness.search();
    cy.get('p').should('contains.text', 'Brochure sent');
  });

  it('should test an invalid address via interception', () => {
    cy.intercept(/nominatim/, { body: [] });
    const harness = getHarness(RequestInfoComponentHarness);
    harness.writeAddress('Domgasse 5, 1010 Wien');
    harness.search();
    cy.get('p').should('contains.text', 'Address not found');
  });
});
```

</p>
</details>

# Bonus: Visual Regression with Cypress

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
  cy.visit('http://localhost:5000/iframe?id=eternal-holidaycard--default&viewMode=story');
  cy.document().toMatchImageSnapshot();
});
```

</p>
</details>
