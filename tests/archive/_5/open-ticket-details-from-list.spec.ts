// spec: specs/alloy-portal-test-plan.md
// seed: tests/seed.spec.ts

import { expect, test } from "@playwright/test";
import { openPortalRoute } from "./helpers";

test.describe("Tickets and Requests", () => {
  test("Open ticket details from list", async ({ page }) => {
    await openPortalRoute(page, "/hd/ticketsAndRequests/tickets");

    // 1. Click ticket `T000008`.
    await page.getByText("T000008").click();

    // 2. Wait for ticket details to load.
    await expect(page.getByText("T000008")).toBeVisible();
    await expect(page.getByText("Several customers unable to access network")).toBeVisible();
    await expect(page.getByText("Closed")).toBeVisible();

    await expect(page.getByText("T000008")).toBeVisible();
  });
});
