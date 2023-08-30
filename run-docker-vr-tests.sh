#!/bin/bash

docker run --rm -it \
  --add-host storybook:host-gateway \
  -e STORYBOOK_INSTANCE='http://storybook:6006' \
  -v $PWD:/tests \
  -w /tests mcr.microsoft.com/playwright:v1.37.1-jammy \
  npx playwright test --reporter list /tests/visual-regression.spec.ts
