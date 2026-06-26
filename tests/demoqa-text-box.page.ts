import { expect, type Locator, type Page } from '@playwright/test';

export const TEXT_BOX_URL = 'https://demoqa.com/text-box';

export type TextBoxFormData = {
  readonly fullName: string;
  readonly email: string;
  readonly currentAddress: string;
  readonly permanentAddress: string;
};

export class DemoqaTextBoxPage {
  readonly heading: Locator;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly currentAddressInput: Locator;
  readonly permanentAddressInput: Locator;
  readonly submitButton: Locator;
  readonly outputPanel: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Text Box' });
    this.fullNameInput = page.getByPlaceholder('Full Name');
    this.emailInput = page.getByPlaceholder('name@example.com');
    this.currentAddressInput = page.getByPlaceholder('Current Address');
    this.permanentAddressInput = page.locator('#permanentAddress-wrapper textarea');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.outputPanel = page.locator('#output .border');
  }

  async open() {
    await this.page.goto(TEXT_BOX_URL);
    await expect(this.heading).toBeVisible();
  }

  async fillForm(data: TextBoxFormData) {
    await this.fullNameInput.fill(data.fullName);
    await this.emailInput.fill(data.email);
    await this.currentAddressInput.fill(data.currentAddress);
    await this.permanentAddressInput.fill(data.permanentAddress);
  }

  async submit() {
    await this.submitButton.click();
  }

  async expectOutput(data: TextBoxFormData) {
    await expect(this.outputPanel).toBeVisible();
    await expect(this.outputPanel).toContainText(`Name:${data.fullName}`);
    await expect(this.outputPanel).toContainText(`Email:${data.email}`);
    await expect(this.outputPanel).toContainText(`Current Address :${data.currentAddress}`);
    await expect(this.outputPanel).toContainText(`Permananet Address :${data.permanentAddress}`);
  }
}
