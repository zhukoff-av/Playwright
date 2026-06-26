import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { expect, test as setup } from "@playwright/test";
import { alloyPassword, alloyUser } from "./helpers";

const authFile = "playwright/.auth/alloy-user.json";

setup("authenticate Alloy demo user", async ({ browser, page }) => {
  if (existsSync(authFile)) {
    const context = await browser.newContext({ storageState: authFile });
    const existingSessionPage = await context.newPage();

    await existingSessionPage.goto("/hd", { waitUntil: "domcontentloaded" });
    const existingSessionWorks = await existingSessionPage
      .getByRole("heading", { name: "Find a Solution" })
      .isVisible({ timeout: 5_000 })
      .catch(() => false);
    await context.close();

    if (existingSessionWorks) {
      return;
    }
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    await page.context().clearCookies();
    await page.goto("/hd", { waitUntil: "domcontentloaded" });

    await page.getByRole("textbox", { name: "User Name" }).fill(alloyUser);
    await page.getByRole("textbox", { name: "Password" }).fill(alloyPassword);
    await page.getByRole("button", { name: "Sign in" }).click();

    try {
      await expect(page.getByText("Self Service Portal")).toBeVisible({ timeout: 15_000 });
      await expect(page.getByRole("heading", { name: "Find a Solution" })).toBeVisible();
      break;
    } catch (error) {
      lastError = error;

      if (attempt === 3) {
        throw lastError;
      }

      await page.waitForTimeout(1_000 * attempt);
    }
  }

  mkdirSync(dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
