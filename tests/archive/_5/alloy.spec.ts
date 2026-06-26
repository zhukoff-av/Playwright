import { test, expect } from "@playwright/test";

test.describe("Alloy service", () => {
  test("happy path", async ({ page }) => {
    await page.goto("/hd", { waitUntil: "domcontentloaded" });

    // await page.pause();

    await expect(
      page.getByText("Self Service PortalYour business motto"),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Find a Solution" }),
    ).toBeVisible();

    await expect(
      page.getByRole("textbox", { name: "Search for solutions," }),
    ).toBeVisible();

    // await page.getByText("Submit a TicketReport an").click();

    // await page.getByText("Request a Service");
    // await page.getByRole("button").first().click();
    // await page.getByText("Request a ServiceBrowse the").click();
    // await page.getByRole("heading", { name: "Service Catalog" }).click();
  });
});
