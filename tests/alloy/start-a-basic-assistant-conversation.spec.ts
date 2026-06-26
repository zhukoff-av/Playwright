// spec: specs/alloy-portal-test-plan.md
// seed: tests/seed.spec.ts

import { expect, test } from "@playwright/test";

test.describe("AI Assistant", () => {
  test("Start a basic assistant conversation", async ({ page }) => {
    await page.goto("/hd", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Self Service Portal")).toBeVisible();

    // 1. Focus the assistant text area with placeholder `Describe your issue or ask a question...`.
    const prompt = page.getByPlaceholder("Describe your issue or ask a question...");
    await expect(prompt).toBeVisible();
    await prompt.click();

    // 2. Type `How do I reset my password?`.
    await prompt.fill("How do I reset my password?");

    // 3. Submit the message.
    await prompt.press("Enter");

    await expect(page.getByText("How do I reset my password?")).toBeVisible();
    await expect(page.getByTitle("New chat")).toBeVisible();
  });
});
