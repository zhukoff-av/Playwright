import { test as base } from '@playwright/test';
import { GitHubRepositoryPage } from '../pages/github-repository.page';

type GitHubFixtures = {
  githubRepositoryPage: GitHubRepositoryPage;
};

export const test = base.extend<GitHubFixtures>({
  githubRepositoryPage: async ({ page }, use) => {
    await use(new GitHubRepositoryPage(page));
  },
});

export { expect } from '@playwright/test';
