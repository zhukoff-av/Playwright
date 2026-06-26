// spec: specs/alloy-login.md
// plan-id: ALLOY-LOGIN-001
import { expect, test } from "@playwright/test";
import { expectPortalSearch } from "./helpers";

test.describe("Alloy service login", () => {
  test("authenticates demo user", async ({ page }) => {
    await page.goto("/hd", { waitUntil: "domcontentloaded" });

    // Assert
    await expect(page.getByText("Self Service Portal")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Find a Solution" }),
    ).toBeVisible();
    await expectPortalSearch(page);
  });
});
