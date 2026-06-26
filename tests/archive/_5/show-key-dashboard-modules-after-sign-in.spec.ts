// spec: specs/alloy-portal-test-plan.md
// plan-id: ALLOY-PORTAL-HOME-001
// seed: tests/seed.spec.ts

import { expect, test } from "@playwright/test";
import { expectPortalSearch } from "./helpers";

test.describe("Home Dashboard", () => {
  test("Show key dashboard modules after sign-in", async ({ page }) => {
    // 1. Verify the home header shows `Self Service Portal`.
    await page.goto("/hd", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Self Service Portal")).toBeVisible();

    // 2. Verify the `Find a Solution` search area is visible.
    await expect(page.getByRole("heading", { name: "Find a Solution" })).toBeVisible();
    await expectPortalSearch(page);

    // 3. Verify dashboard modules are visible.
    for (const heading of [
      "Latest Updates",
      "Popular Service Catalog Items",
      "My Tickets",
      "Approvals",
      "Announcements",
      "Popular Articles",
    ]) {
      await expect(page.getByText(heading).first()).toBeVisible();
    }

    // 4. Verify primary entry points are visible.
    await expect(page.getByText("Submit a Ticket")).toBeVisible();
    await expect(page.getByText("Request a Service")).toBeVisible();
    await expect(page.getByText("Ask a Question")).toBeVisible();
    await expect(page.getByText("Hardware Request")).toBeVisible();
    await expect(page.getByText("How to hook up a printer on your laptop")).toBeVisible();
  });
});
