import { test, expect } from "@playwright/test";

test.describe("Swag Labs — logged in via setup storageState", () => {
  test("inventory loads without logging in again", async ({ page }) => {
    await page.goto("/inventory.html");
    await expect(page.locator('[data-test="inventory-container"]')).toBeVisible();
  });

  test("can open cart from inventory", async ({ page }) => {
    await page.goto("/inventory.html");
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL("/cart.html");
  });
});
