import { test, type Page, expect } from "@playwright/test";
import { HeaderComponent } from "./components/header.component";
import {
  GetToKnowComponent,
  GTKInputField,
} from "./components/getToKnow.component";

test.describe("Home Page", () => {
  const data: GTKInputField = {
    firstName: "Test",
    lastName: "User",
    email: "testuser123123@apple.com",
    phone: "+1789789789",
    message: "Hello!",
  };

  test("positive case", async ({ page }) => {
    await page.goto("/");

    const header = new HeaderComponent(page);
    await header.expectIsVisible();
    await header.goToDemoPage();

    const inputForm = new GetToKnowComponent(page);

    await inputForm.fillInputFields(data);
  });
});
