// spec: specs/alloy-portal-test-plan.md
// plan-id: ALLOY-PORTAL-TICKET-002
// seed: tests/seed.spec.ts

import { expect, test } from "@playwright/test";
import { openPortalRoute } from "./helpers";

test.describe("Ticket Creation", () => {
  test("Validate required fields on ticket form", async ({ page }) => {
    // 1. Leave all required fields blank.
    await openPortalRoute(page, "/hd/?create=true&entity=tickets&action=682");
    await expect(page.getByText("Report a Technical Issue")).toBeVisible();

    // 2. Click `Next`.
    await page.getByRole("button", { name: "Next" }).click();

    await expect(page.getByText("Report a Technical Issue")).toBeVisible();
    await expect(page.getByText("Field can`t be empty").first()).toBeVisible();
  });
});
