// spec: specs/alloy-portal-test-plan.md
// plan-id: ALLOY-PORTAL-ANNOUNCEMENT-001
// seed: tests/seed.spec.ts

import { expect, test } from "@playwright/test";
import { disableAssistantOverlay } from "./helpers";

test.describe("Knowledge Base and Announcements", () => {
  test("View announcement details", async ({ page }) => {
    // 1. Open the home page.
    await page.goto("/hd", { waitUntil: "domcontentloaded" });
    await disableAssistantOverlay(page);

    // 2. Click announcement `Network Shares, Email and Internet Access Temporarily Unavailable`.
    await page
      .getByText("Network Shares, Email and Internet Access Temporarily Unavailable")
      .click();

    await expect(
      page.getByText("Network Shares, Email and Internet Access Temporarily Unavailable"),
    ).toBeVisible();
    await expect(page.getByText(/5\/4\/2026|temporarily unavailable/i).first()).toBeVisible();
  });
});
