import { expect, test } from "@playwright/test";
import { HeaderComponent } from "../components/header.component";

test.describe("Alloy Software Product test", () => {
  test("positive case home page", async ({ page }) => {
    await page.goto("https://www.alloysoftware.com");

    const header = new HeaderComponent(page);

    header.expectToBeVisible();

    const getADemoBtn = page.getByRole("link", { name: "Get a Demo" });

    await expect(getADemoBtn).toBeVisible();
    await getADemoBtn.click();

    await page.waitForURL("https://www.alloysoftware.com/demo/");

    await page
      .locator('iframe[title="Form 0"]')
      .contentFrame()
      .getByRole("textbox", { name: "First name*" })
      .click();
    await page
      .locator('iframe[title="Form 0"]')
      .contentFrame()
      .getByRole("textbox", { name: "First name*" })
      .fill("Test");
    await page
      .locator('iframe[title="Form 0"]')
      .contentFrame()
      .getByRole("textbox", { name: "First name*" })
      .press("Tab");
    await page
      .locator('iframe[title="Form 0"]')
      .contentFrame()
      .getByRole("textbox", { name: "Last name*" })
      .fill("User");
    await page
      .locator('iframe[title="Form 0"]')
      .contentFrame()
      .getByRole("textbox", { name: "Last name*" })
      .press("Tab");
    await page
      .locator('iframe[title="Form 0"]')
      .contentFrame()
      .getByRole("textbox", { name: "Business email*" })
      .fill("testuser@gmail.com");
    await page
      .locator('iframe[title="Form 0"]')
      .contentFrame()
      .getByRole("textbox", { name: "Business email*" })
      .press("Tab");
    await page
      .locator('iframe[title="Form 0"]')
      .contentFrame()
      .getByRole("textbox", { name: "Phone" })
      .fill("+145678");
    await page
      .locator('iframe[title="Form 0"]')
      .contentFrame()
      .getByLabel("IT Asset Management")
      .check();
    await page
      .locator('iframe[title="Form 0"]')
      .contentFrame()
      .locator("li")
      .filter({ hasText: "Network Inventory" })
      .click();
    await page
      .locator('iframe[title="Form 0"]')
      .contentFrame()
      .locator("li")
      .filter({ hasText: "Software Asset Management" })
      .click();
    await page
      .locator('iframe[title="Form 0"]')
      .contentFrame()
      .getByRole("textbox", { name: "Message" })
      .click();
    await page
      .locator('iframe[title="Form 0"]')
      .contentFrame()
      .getByRole("textbox", { name: "Message" })
      .fill("Hello. Tell me more about the product. Thx");

    await expect(
      page
        .locator('iframe[title="Form 0"]')
        .contentFrame()
        .getByRole("button", { name: "Let’s get started" }),
    ).toBeVisible();
  });
});
