import { test, type Page, expect } from "@playwright/test";

test.describe("Swag Labs", () => {
  test.skip("Login Page", async ({ page }) => {
    await page.goto("/");

    // Login
    await page.locator('[data-test="username"]').fill("standard_user");
    await page.locator('[data-test="password"]').fill("secret_sauce");
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL("/inventory.html");

    await page.pause();

    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.getByText("Continue ShoppingCheckout").click();
    await page
      .locator('[data-test="inventory-item-description"]')
      .first()
      .click();
    await page.locator('[data-test="item-4-img-link"]').hover();
    await page.locator('[data-test="item-0-img-link"]').hover();
    await page
      .locator('[data-test="inventory-item-description"]')
      .nth(1)
      .hover();
    await page.getByText("$29.99").hover();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').hover();
  });

  test("Test __ ", () => {});
});
