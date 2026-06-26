// spec: specs/alloy-portal-test-plan.md
// seed: tests/seed.spec.ts

import { expect, test } from "@playwright/test";
import { openPortalRoute } from "./helpers";

test.describe("Service Catalog", () => {
  test("Open a service item details page", async ({ page }) => {
    await openPortalRoute(page, "/hd/serviceCatalog");

    // 1. Open `Hardware Request`.
    await page.getByText("Hardware Request", { exact: true }).click();

    // 2. Verify item details are displayed.
    await expect(page.getByText("Hardware Request", { exact: true })).toBeVisible();
    await expect(page.getByText(/Request for new hardware/i)).toBeVisible();

    // 3. Click `Submit`.
    await page.getByText("Submit", { exact: true }).first().click();
    await expect(page.getByText(/Hardware Request|Please fill in the following fields/i)).toBeVisible();
  });
});
