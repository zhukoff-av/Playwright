import { expect, test } from '@playwright/test';
import { DemoqaTextBoxPage } from './demoqa-text-box.page';

test.describe('DemoQA Text Box page', () => {
  test('Reject Invalid Email Format', async ({ page }) => {
    const textBoxPage = new DemoqaTextBoxPage(page);

    // 1. Open `https://demoqa.com/text-box`.
    await textBoxPage.open();

    // 2. Enter a full name.
    await textBoxPage.fullNameInput.fill('Alan Turing');

    // 3. Enter an invalid email address without a valid domain.
    await textBoxPage.emailInput.fill('alan.turing');

    // 4. Enter current and permanent addresses.
    await textBoxPage.currentAddressInput.fill('Bletchley Park');
    await textBoxPage.permanentAddressInput.fill('Maida Vale');

    // 5. Click Submit.
    await textBoxPage.submit();

    // 6. Validate that the email field is marked invalid.
    await expect(textBoxPage.emailInput).toHaveClass(/field-error/);

    // 7. Validate that no submission output is visible.
    await expect(textBoxPage.outputPanel).toBeHidden();
  });
});
