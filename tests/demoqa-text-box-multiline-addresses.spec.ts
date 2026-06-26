// spec: specs/demoqa-text-box.md
// plan-id: DEMOQA-TEXT-BOX-003
import { test } from '@playwright/test';
import { DemoqaTextBoxPage, type TextBoxFormData } from './demoqa-text-box.page';

const contactWithMultilineAddresses: TextBoxFormData = {
  fullName: 'Grace Hopper',
  email: 'grace.hopper@example.com',
  currentAddress: 'Building 600\nArlington, VA',
  permanentAddress: '7 Compiler Court\nNew York, NY',
};

test.describe('DemoQA Text Box page', () => {
  test('Submit Multiline Addresses', async ({ page }) => {
    const textBoxPage = new DemoqaTextBoxPage(page);

    // 1. Open `https://demoqa.com/text-box`.
    await textBoxPage.open();

    // 2. Enter a full name and valid email.
    // 3. Enter a multiline current address.
    // 4. Enter a different multiline permanent address.
    await textBoxPage.fillForm(contactWithMultilineAddresses);

    // 5. Click Submit.
    await textBoxPage.submit();

    // 6. Validate that both addresses are rendered in the output panel and preserve each address line.
    await textBoxPage.expectOutput(contactWithMultilineAddresses);
  });
});
