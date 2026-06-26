import { expect, test } from "@playwright/test";

test("Test Pipeline @githubAction", async ({ page }) => {
  await page.goto("https://demo.playwright.dev/todomvc/#/");

  await expect(page.getByRole("heading", { name: "todos" })).toBeVisible();
  await expect(page.getByPlaceholder("What needs to be done?")).toBeVisible();
});
