import { Page } from "@playwright/test";

export type GTKInputField = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

export class GetToKnowComponent {
  constructor(private readonly page: Page) {}

  async fillInputFields(data: GTKInputField) {
    const iFrame = this.page.locator('iframe[title="Form 0"]').contentFrame();

    await iFrame
      .getByRole("textbox", { name: "First name*" })
      .fill(data.firstName);
    await iFrame
      .getByRole("textbox", { name: "Last name*" })
      .fill(data.lastName);
    await iFrame
      .getByRole("textbox", { name: "Business email*" })
      .fill(data.email);
    await iFrame.getByRole("textbox", { name: "Phone" }).fill(data.phone);
    await iFrame.getByRole("textbox", { name: "Message" }).fill(data.message);
  }
}

// await page
// .locator('iframe[title="Form 0"]')
// .contentFrame()
// .getByLabel("IT Asset Management")
// .check();
// await page
// .locator('iframe[title="Form 0"]')
// .contentFrame()
// .getByLabel("Network Inventory")
// .check();
// await page
// .locator('iframe[title="Form 0"]')
// .contentFrame()
// .getByLabel("Software Asset Management")
// .check();
// await page
// .locator('iframe[title="Form 0"]')
// .contentFrame()
// .getByRole("textbox", { name: "Message" })
// .click();
// await page
// .locator('iframe[title="Form 0"]')
// .contentFrame()
// .getByRole("textbox", { name: "Message" })
// .fill("hello. tyelll ");

// // check: toBeVisible
// await expect(
// page
//   .locator('iframe[title="Form 0"]')
//   .contentFrame()
//   .getByRole("button", { name: "Let’s get started" }),
// ).toBeVisible();
