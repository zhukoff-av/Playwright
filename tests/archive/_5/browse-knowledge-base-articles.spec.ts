// spec: specs/alloy-portal-test-plan.md
// plan-id: ALLOY-PORTAL-KB-001
// seed: tests/seed.spec.ts

import { expect, test } from "@playwright/test";
import { openPortalRoute } from "./helpers";

test.describe("Knowledge Base and Announcements", () => {
  test("Browse Knowledge Base articles", async ({ page }) => {
    // 1. Open `/hd/knowledgeBase`.
    await openPortalRoute(page, "/hd/knowledgeBase");

    // 2. Verify `Knowledge Base` and `All Articles` are visible.
    await expect(page.getByRole("heading", { name: "Knowledge Base" })).toBeVisible();
    await expect(page.getByText("All Articles").first()).toBeVisible();

    // 3. Verify article list includes visible article IDs and titles.
    await expect(page.getByText("KB000003")).toBeVisible();
    await expect(page.getByText("How to hook up a printer on your laptop")).toBeVisible();

    // 4. Open `KB000003 How to hook up a printer on your laptop`.
    await page.getByText("How to hook up a printer on your laptop").click();
    await expect(page.getByText("How to hook up a printer on your laptop")).toBeVisible();
    await expect(page.getByText("KB000003")).toBeVisible();
  });
});
