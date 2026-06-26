// spec: specs/alloy-portal-test-plan.md
// plan-id: ALLOY-PORTAL-AUTH-002
// seed: tests/seed.spec.ts

import { expect, test } from "@playwright/test";
import { withAuthLock } from "./helpers";

test.describe("Authentication", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("Reject invalid credentials", async ({ page }) => {
    await withAuthLock(async () => {
      // 1. Open `/hd`.
      await page.goto("/hd", { waitUntil: "domcontentloaded" });

      // 2. Fill `User Name` with an invalid value.
      await page.getByRole("textbox", { name: "User Name" }).fill(`invalid-${Date.now()}`);

      // 3. Fill `Password` with an invalid value.
      await page.getByRole("textbox", { name: "Password" }).fill("invalid-password");

      // 4. Click `Sign in`.
      await page.getByRole("button", { name: "Sign in" }).click();

      await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
      await expect(page.getByText(/Sign-in failed/i)).toBeVisible();
      await expect(page.getByRole("heading", { name: "Find a Solution" })).toBeHidden();
    });
  });
});
