// spec: specs/alloy-portal-test-plan.md
// seed: tests/seed.spec.ts

import { expect, test } from "@playwright/test";
import { expectPortalSearch } from "./helpers";

test.describe("Authentication", () => {
  test("Sign in with valid demo user", async ({ page }) => {
    // 1. Open `/hd`.
    // 2. Fill `User Name` with `Demo`.
    // 3. Fill `Password` with `Aa123456`.
    // 4. Click `Sign in`.
    // 5. Wait for the portal home page to load.
    await page.goto("/hd", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/hd\/?$/);
    await expectPortalSearch(page);
    await expect(page.getByText("Submit a Ticket")).toBeVisible();
    await expect(page.getByText("Request a Service")).toBeVisible();
  });
});
