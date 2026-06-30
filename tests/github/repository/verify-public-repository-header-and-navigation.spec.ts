// spec: specs/github-repository.md
// plan-id: GITHUB-REPOSITORY-001
import { expect, test } from './fixtures/github.fixtures';

test.describe('GitHub Repository page', () => {
  test('Verify Public Repository Header and Navigation', async ({ githubRepositoryPage }) => {
    // 1. Open `https://github.com/zhukoff-av/Playwright`.
    await githubRepositoryPage.open();

    // 2. Validate that the browser remains on the `zhukoff-av/Playwright` repository page.
    await githubRepositoryPage.expectRepositoryPageLoaded();

    // 3. Validate that the repository name `Playwright` is visible.
    await expect(githubRepositoryPage.repositoryName).toBeVisible();

    // 4. Validate that repository navigation exposes `Code`, `Issues`, and `Pull requests`.
    await expect(githubRepositoryPage.codeLink).toBeVisible();
    await expect(githubRepositoryPage.issuesLink).toBeVisible();
    await expect(githubRepositoryPage.pullRequestsLink).toBeVisible();
  });
});
