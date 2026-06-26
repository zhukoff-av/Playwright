// spec: specs/alloy-portal-test-plan.md
// seed: tests/seed.spec.ts

import { expect, test } from "@playwright/test";
import { openPortalRoute } from "./helpers";

test.describe("Ticket Creation", () => {
  test("Open Report a Technical Issue form", async ({ page }) => {
    // 1. Click `Submit a Ticket`.
    await openPortalRoute(page, "/hd/?create=true&entity=tickets&action=682");

    // 2. Wait for the `Report a Technical Issue` form.
    await expect(page.getByText("Report a Technical Issue")).toBeVisible();
    await expect(page.getByText("Summary *").first()).toBeVisible();
    await expect(page.getByText("Description *").first()).toBeVisible();
    await expect(page.getByText("Category").first()).toBeVisible();
    await expect(page.getByText("Urgency *").first()).toBeVisible();
    await expect(page.getByText("Impact *").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Back", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Next", exact: true })).toBeVisible();
  });
});
