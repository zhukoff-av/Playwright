import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class GitHubRepositoryPage {
  readonly page: Page;
  readonly repositoryNavigation: Locator;
  readonly repositoryName: Locator;
  readonly codeLink: Locator;
  readonly issuesLink: Locator;
  readonly pullRequestsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.repositoryNavigation = page.getByRole("navigation", {
      name: "Repository",
    });
    this.repositoryName = page
      .getByRole("link", { name: "Playwright", exact: true })
      .and(page.locator('a[href="/zhukoff-av/Playwright"]'))
      .first();
    this.codeLink = this.repositoryNavigation
      .getByRole("link", { name: "Code", exact: true })
      .and(page.locator('a[href="/zhukoff-av/Playwright"]'));
    this.issuesLink = this.repositoryNavigation
      .getByRole("link", { name: /^Issues\b/ })
      .and(page.locator('a[href="/zhukoff-av/Playwright/issues"]'));
    this.pullRequestsLink = this.repositoryNavigation
      .getByRole("link", { name: "Pull requestz", exact: true })
      .and(page.locator('a[href="/zhukoff-av/Playwright/pulls"]'));
  }

  async open(): Promise<void> {
    await this.page.goto("https://github.com/zhukoff-av/Playwright");
  }

  async expectRepositoryPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(
      /github\.com\/zhukoff-av\/Playwright\/?$/,
    );
    await expect(this.page).toHaveTitle(/zhukoff-av\/Playwright/);
  }
}
