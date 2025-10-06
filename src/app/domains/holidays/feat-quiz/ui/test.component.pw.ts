import { test, expect } from '@testronaut/angular';
import { TestComponent } from './test.component';

test('should show the test component', async ({ mount, page }) => {
  await mount(TestComponent);
  await expect(page.getByText('Test')).toBeVisible();
});
