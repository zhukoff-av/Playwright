// spec: specs/alloy-portal-test-plan.md
// seed: tests/seed.spec.ts

import { expect, test } from "@playwright/test";
import { openPortalRoute } from "./helpers";

test.describe("Tickets and Requests", () => {
  test("View My Tickets list", async ({ page }) => {
    // 1. Open `My Tickets` or `/hd/ticketsAndRequests/tickets`.
    await openPortalRoute(page, "/hd/ticketsAndRequests/tickets");

    // 2. Verify the tickets table is visible.
    await expect(page.getByRole("heading", { name: "Tickets and Requests" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Ticket" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Summary" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Status" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Created Date" })).toBeVisible();

    // 3. Check columns for ticket number, summary, status, and created date.
    await expect(page.getByText("T000008")).toBeVisible();
    await expect(page.getByText("Several customers unable to access network")).toBeVisible();
    await expect(page.getByText("Closed")).toBeVisible();
    await expect(page.getByText("Rows per page")).toBeVisible();
  });
});
