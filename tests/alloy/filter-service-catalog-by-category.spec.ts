// spec: specs/alloy-portal-test-plan.md
// seed: tests/seed.spec.ts

import { expect, test } from "@playwright/test";
import { openPortalRoute } from "./helpers";

test.describe("Service Catalog", () => {
  test("Filter service catalog by category", async ({ page }) => {
    await openPortalRoute(page, "/hd/serviceCatalog");

    // 1. Select category `Access`.
    await page.locator("#mui-tree-view-1").getByText("Access", { exact: true }).click();

    // 2. Review visible catalog items.
    await expect(page.getByText("Account Creation", { exact: true })).toBeVisible();
    await expect(page.getByText("Remote Access", { exact: true })).toBeVisible();

    // 3. Select category `Equipment`.
    await page.locator("#mui-tree-view-1").getByText("Equipment", { exact: true }).click();

    // 4. Review visible catalog items.
    await expect(page.getByText("Hardware Request", { exact: true })).toBeVisible();
    await expect(page.getByText("Printer Request", { exact: true })).toBeVisible();
  });
});
