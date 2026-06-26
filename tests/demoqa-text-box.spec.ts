import { expect, test } from '@playwright/test';

const TEXT_BOX_URL = 'https://demoqa.com/text-box';

test.describe('DemoQA Text Box page', () => {
  test('Verify Text Box Page Title and Heading', async ({ page }) => {
    test.fail(true, 'DemoQA currently sets the browser title to "demosite" instead of a title containing "Text Box".');

    // 1. Open `https://demoqa.com/text-box`.
    await page.goto(TEXT_BOX_URL);

    // 2. Validate that the page has a visible heading `Text Box`.
    await expect(page.getByRole('heading', { name: 'Text Box' })).toBeVisible();

    // 3. Validate that the browser page title contains `Text Box`.
    await expect(page).toHaveTitle(/Text Box/);
  });
});
