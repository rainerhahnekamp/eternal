- [1. Initial Setup](#1-initial-setup)
- [2. Screenshotting Home](#2-screenshotting-home)
- [3. Checking various screens](#3-checking-various-screens)
- [4. Bonus: Fullscreen](#4-bonus-fullscreen)
- [5. Bonus: Watch Puppeteer at Work](#5-bonus-watch-puppeteer-at-work)
- [6. Bonus: OS-Independent Screenshots](#6-bonus-os-independent-screenshots)

# 1. Initial Setup

In order to make that work, we need have a dedicated jest configuration. Study following files:

1.  `jest.config-vr.js`
2.  `setup-jest-vr.ts`

# 2. Screenshotting Home

1. Screenshot home with a unit test. Create a new test file `home.component.spec-vr.ts`.

```typescript
describe('Home', () => {
  it('should screenshot home', async () => {
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  });
});
```

2. Make sure the frontend is running in parallel, then run `jest-vr` again.

3. Ensure that there in the home directory, there is a new subfolder called `_image_snapshots_`. It should contain image of home.
4. Open `home.css`, and add following styling: `p {font-weight: bold}`. Rerun the test. It should fail.
5. Make sure, you have now another subfolder called `_diff_output_`. It should contain the two images and also the diff image.
6. Revert your changes to `home.css` and make sure that the test turns green.

# 3. Checking various screens

Our holidays screen has per offered holiday a card. Make screenshots, but this time also check for the most common resolutions.

Create a new test file `holidays.component.spec-vr.ts` in the component folder:

```typescript
describe('Holidays', () => {
  const gridGenerator: [string, number, number][] = [
    ['iPad', 768, 1024],
    ['iPhone 8', 414, 736],
    ['HD Ready', 1280, 720],
    ['Full HD', 1920, 1080],
    ['UHD', 3840, 2160]
  ];

  it.each(gridGenerator)('should make a screenshot of %s', async (_, width, height) => {
    await page.setViewport({ width, height });
    await page.goto('http://localhost:4200/holidays', {
      waitUntil: 'networkidle0'
    });
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  });
});
```

Checkout out the generated images.

# 4. Bonus: Fullscreen

`/customers` lists 20 customers which means the user has to scroll but also that we don't have the complete page in our screenshot by default.

We are using an extension that screenshot the full page.

Under the customers component, create the new file `customers.component.spec-vr.ts`:

```typescript
import fullPageScreenshot from 'puppeteer-full-page-screenshot';

describe('Home', () => {
  it('should screenshot customers', async () => {
    await page.goto('http:///localhost:4200/customer', {
      waitUntil: 'networkidle0'
    });
    const jimp = await fullPageScreenshot(page, { delay: 0 });
    const image = await new Promise((resolve) =>
      jimp.getBuffer('image/png', (_, buffer) => resolve(buffer))
    );
    expect(image).toMatchImageSnapshot();
  }, 20000);
});
```

**Note**: This test has a timeout of 20 seconds. You might have to increase that number even more. Once you successfully run that test, set it to ignore, i.e. `it.skip("should ...)`.

# 5. Bonus: Watch Puppeteer at Work

1. Open a chromium instance via the command line and pass following flags: `--remote-debugging-port=9222`
2. Open a second browser with following URL: `http://localhost:9222/json/version`
3. Grab the value of the property `webSocketDebuggerUrl`.
4. Create a new file `jest-puppeteer.config.js` in the root folder and add following entry:

```js
module.exports = {
  connect: {
    browserWSEndpoint: '[webSocketDebuggerUrl]'
  }
};
```

5. Replace `[webSocketDebuggerUrl]` with the one you copied over.

6. Rerun the vr docker run -dit --name puppeteer browserless/chrome:1.40.2-chrome-stables and watch how Chromium opens your website and makes the screenshots.
7. Move back to the headless browser by commenting the `browserWSEndpoint property

# 6. Bonus: OS-Independent Screenshots

The rendering and therefore the screenshots depend very much on the operating system and browser. This will ultimately lead to false positives. Docker provides a solution because it encapsulates the operating system the browser. Therefore every developer, even CI gets the same screenshots.

1. Make sure you have Docker up and running.
2. Run a pre-defined Docker image

```bash
docker container run -d -p 9222:9222 zenika/alpine-chrome --no-sandbox --remote-debugging-address=0.0.0.0 --remote-debugging-port=9222
```

3. As we did before, open your browser on `http://localhost:9222/json/version` and fetch the `webSocketDebuggerUrl`.

4. Make sure you have committed your latest changes.

5. Modify the URL in the home-vr test. If Docker runs on your same machine, you just need to replace `http://localhost:4200` with `http://host.docker.internal:4200`.

6. Rerun the tests, if everything works, jest should only run the test for the home screen and fails. You will see in the image diff output, that it highlights the especially fonts.
