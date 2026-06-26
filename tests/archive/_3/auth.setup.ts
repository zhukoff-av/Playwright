import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/swag-user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();

  await expect(page).toHaveURL("/inventory.html");

  mkdirSync(dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
