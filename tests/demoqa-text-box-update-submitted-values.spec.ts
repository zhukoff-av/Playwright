// spec: specs/demoqa-text-box.md
// plan-id: DEMOQA-TEXT-BOX-005
import { expect, test } from '@playwright/test';
import { DemoqaTextBoxPage, type TextBoxFormData } from './demoqa-text-box.page';

const firstContact: TextBoxFormData = {
  fullName: 'Katherine Johnson',
  email: 'katherine.johnson@example.com',
  currentAddress: 'Langley Research Center',
  permanentAddress: 'White Sulphur Springs',
};

const secondContact: TextBoxFormData = {
  fullName: 'Dorothy Vaughan',
  email: 'dorothy.vaughan@example.com',
  currentAddress: 'West Area Computing Unit',
  permanentAddress: 'Newport News',
};

test.describe('DemoQA Text Box page', () => {
  test('Update Submitted Values on a Later Submission', async ({ page }) => {
    const textBoxPage = new DemoqaTextBoxPage(page);

    // 1. Open `https://demoqa.com/text-box`.
    await textBoxPage.open();

    // 2. Submit one complete set of valid contact details.
    await textBoxPage.fillForm(firstContact);
    await textBoxPage.submit();
    await textBoxPage.expectOutput(firstContact);

    // 3. Replace every field with a second complete set of valid contact details.
    await textBoxPage.fillForm(secondContact);

    // 4. Click Submit again.
    await textBoxPage.submit();

    // 5. Validate that the output panel shows the second set of values.
    await textBoxPage.expectOutput(secondContact);

    // 6. Validate that the first set of values is no longer shown.
    await expect(textBoxPage.outputPanel).not.toContainText(firstContact.fullName);
    await expect(textBoxPage.outputPanel).not.toContainText(firstContact.email);
    await expect(textBoxPage.outputPanel).not.toContainText(firstContact.currentAddress);
    await expect(textBoxPage.outputPanel).not.toContainText(firstContact.permanentAddress);
  });
});
