// spec: specs/alloy-portal-test-plan.md
// plan-id: ALLOY-PORTAL-HOME-002
// seed: tests/seed.spec.ts

import { expect, test } from "@playwright/test";
import { disableAssistantOverlay } from "./helpers";

test.describe("Home Dashboard", () => {
  test("Search from Find a Solution", async ({ page }) => {
    await page.goto("/hd", { waitUntil: "domcontentloaded" });
    await disableAssistantOverlay(page);

    // 1. Click the solution search field.
    const search = page.getByRole("textbox", { name: /search for solutions/i });
    await search.click();

    // 2. Search for `printer`.
    await search.fill("printer");

    // 3. Submit the search.
    await search.press("Enter");

    await expect(page.getByText(/printer/i).first()).toBeVisible();
  });
});
