import { expect, type Page } from "@playwright/test";

export class HeaderComponent {
  constructor(private readonly page: Page) {}

  async expectToBeVisible() {
    await expect(
      this.page.getByRole("link", { name: "Products" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Solutions" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Resources" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Pricing" }),
    ).toBeVisible();
  }
}
