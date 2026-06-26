// spec: specs/alloy-portal-test-plan.md
// seed: tests/seed.spec.ts

import { expect, test } from "@playwright/test";
import { openPortalRoute } from "./helpers";

test.describe("Service Catalog", () => {
  test("Browse all service catalog items", async ({ page }) => {
    // 1. Open `Request a Service` from the home page.
    await openPortalRoute(page, "/hd/serviceCatalog");

    // 2. Verify the `Service Catalog` page opens.
    await expect(page.getByRole("heading", { name: "Service Catalog" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "All Services" })).toBeVisible();

    // 3. Verify categories are visible.
    for (const category of ["Access", "Equipment", "General", "Personnel", "Software", "Training"]) {
      await expect(page.getByText(category, { exact: true }).first()).toBeVisible();
    }

    // 4. Verify service items are listed with `Submit` actions.
    for (const item of ["Account Creation", "Hardware Request", "Remote Access", "Software Request"]) {
      await expect(page.getByText(item, { exact: true })).toBeVisible();
    }
    await expect(page.getByText("Submit").first()).toBeVisible();
  });
});
