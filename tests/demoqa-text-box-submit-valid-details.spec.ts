import { test } from '@playwright/test';
import { DemoqaTextBoxPage, type TextBoxFormData } from './demoqa-text-box.page';

const validContact: TextBoxFormData = {
  fullName: 'Ada Lovelace',
  email: 'ada.lovelace@example.com',
  currentAddress: '12 Analytical Engine Road',
  permanentAddress: '42 Difference Engine Lane',
};

test.describe('DemoQA Text Box page', () => {
  test('Submit Valid Contact Details', async ({ page }) => {
    const textBoxPage = new DemoqaTextBoxPage(page);

    // 1. Open `https://demoqa.com/text-box`.
    await textBoxPage.open();

    // 2. Enter a full name, valid email, current address, and permanent address.
    await textBoxPage.fillForm(validContact);

    // 3. Click Submit.
    await textBoxPage.submit();

    // 4. Validate that the output panel is visible.
    // 5. Validate that the output panel shows the submitted name, email, current address, and permanent address.
    await textBoxPage.expectOutput(validContact);
  });
});
