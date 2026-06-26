import { expect, test } from '@playwright/test';
import { DemoqaTextBoxPage } from './demoqa-text-box.page';

test.describe('DemoQA Text Box page', () => {
  test('Verify Text Box Page Renders the Expected Form', async ({ page }) => {
    const textBoxPage = new DemoqaTextBoxPage(page);

    // 1. Open `https://demoqa.com/text-box`.
    await textBoxPage.open();

    // 2. Validate that the page has a visible heading `Text Box`.
    await expect(textBoxPage.heading).toBeVisible();

    // 3. Validate that the Full Name, Email, Current Address, and Permanent Address fields are visible and editable.
    await expect(textBoxPage.fullNameInput).toBeEditable();
    await expect(textBoxPage.emailInput).toBeEditable();
    await expect(textBoxPage.currentAddressInput).toBeEditable();
    await expect(textBoxPage.permanentAddressInput).toBeEditable();

    // 4. Validate that the Submit button is visible and enabled.
    await expect(textBoxPage.submitButton).toBeEnabled();
  });
});
