import { expect, Page } from "@playwright/test";

export class HeaderComponent {
  constructor(private readonly page: Page) {}

  async expectIsVisible() {
    await expect(
      this.page.getByRole("link", { name: "Products" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Solutions" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Company" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Pricing" }),
    ).toBeVisible();
  }

  async goToDemoPage() {
    await this.page.getByRole("link", { name: "Get a Demo" }).click();
    await expect(this.page).toHaveURL(/\/demo/);
  }
}
