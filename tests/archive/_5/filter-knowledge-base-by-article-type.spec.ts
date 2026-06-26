// spec: specs/alloy-portal-test-plan.md
// plan-id: ALLOY-PORTAL-KB-002
// seed: tests/seed.spec.ts

import { expect, test } from "@playwright/test";
import { openPortalRoute } from "./helpers";

test.describe("Knowledge Base and Announcements", () => {
  test("Filter Knowledge Base by article type", async ({ page }) => {
    await openPortalRoute(page, "/hd/knowledgeBase");

    // 1. Select a visible article type filter, such as `Hardware` or `Software`.
    await page.getByText("Hardware", { exact: true }).click();

    // 2. Review the article list.
    await expect(page.getByText(/KB\d{6}|There are no items to display|Visible:/i).first()).toBeVisible();
  });
});
