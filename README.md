# Playwright


![Build Status](https://github.com/zhukoff-av/Playwright/actions/workflows/main.yml/badge.svg) [![Maintainability](https://api.codeclimate.com/v1/badges/0984caa92765329bb5d4/maintainability)](https://codeclimate.com/github/zhukoff-av/Playwright/maintainability)
![Top Language](https://img.shields.io/github/languages/top/zhukoff-av/Playwright)




This project uses Playwright to automate end-to-end testing for web applications. It includes essential setup, sample scripts, and instructions for running tests in various environments and modes.

Table of Contents

## Table of Contents

- [Project Overview](#project-overview)
- [Installation](#installation)
- [Scripts](#scripts)
- [Using GitHub Issues with Agents](#using-github-issues-with-agents)
- [AI Agent QA Workflows](#ai-agent-qa-workflows)
- [Usage](#usage)
- [Running Tests](#running-tests)
- [Test Reporting](#test-reporting)
- [Additional Playwright Commands](#additional-playwright-commands)
- [Contributing](#contributing)
- [License](#license)

### Project Overview

This project is designed to test a web application’s functionality through automated end-to-end tests using Playwright. Playwright enables reliable testing across different browsers and provides a flexible API for interacting with UI elements, simulating user behavior, and capturing reports.

### Installation

#### 1.	Clone the repository:

    git clone <repository-url>
    cd <repository-name>


#### 2.	Install dependencies:
This project uses pnpm for package management. To install dependencies, run:

    pnpm install


#### 3.	Install Playwright browsers:
Playwright requires browser binaries to be downloaded. Install them with:

    pnpm exec playwright install


### Scripts

The following scripts are defined in package.json for ease of use:

#### Run All Tests:

    pnpm run example

Executes all Playwright tests.

#### View Test Report:

    pnpm run report

Opens a visual report for recent test results.

#### Run Tests in UI Mode:

    pnpm run test-ui-mode

Opens the Playwright Test Runner in UI mode, allowing you to run and debug individual tests interactively.

#### Run Tests on Chromium (headed):

    pnpm run test-chromium

Runs tests specifically in Chromium with a visible browser window.

### Using GitHub Issues with Agents

Use the `codex:issue` script to have a local Codex agent implement a GitHub issue.
The script fetches the issue with the GitHub CLI, starts Codex in this repository, and
passes the issue body and comments to the agent. After the agent finishes, the script
runs local evals, commits the changes, pushes the branch, checks GitHub Actions for the pushed commit, and closes the
issue only after CI is green.

For example, to run Codex against issue `#7`:

    pnpm run codex:issue -- 7

Requirements:

- Install and authenticate the GitHub CLI: `gh auth login`.
- Make sure the Codex CLI is available on your `PATH`, or set `CODEX_BIN=/path/to/codex`.
- Run the command from this repository so the script can detect the GitHub repo.
- Start from a clean working tree. The script exits before running the agent if local
  changes are already present.

Successful run lifecycle:

1. Fetches the GitHub issue.
2. Runs the Codex agent against the issue content using the loop: trace every run, judge evidence, diagnose, fix,
   validate, ship.
3. Requires the agent to produce repository changes.
4. Runs local evals: `npm run plan-coverage` and `pnpm exec playwright test` by default.
5. Feeds failed local eval logs back to Codex for another diagnose/fix attempt, up to `CODEX_ISSUE_MAX_ATTEMPTS`.
6. Commits only after local evals pass.
7. Pushes the commit to the current upstream branch, or pushes with upstream tracking if needed.
8. Watches GitHub Actions for the pushed commit.
9. If CI fails, feeds failed CI logs and run memory back to Codex for another repair attempt.
10. Closes the GitHub issue only after the pushed commit has green CI, unless `CODEX_ISSUE_AUTO_CLOSE=false`.

Optional settings:

- Pass the repo explicitly if it cannot be detected:

      pnpm run codex:issue -- 7 zhukoff-av/Playwright

- Leave the issue open after push and green CI:

      CODEX_ISSUE_AUTO_CLOSE=false pnpm run codex:issue -- 7

  The script still validates, commits, pushes, and checks CI, then posts a status comment instead of closing.

- Override local evals:

      CODEX_ISSUE_VALIDATE_CMD='npm run plan-coverage && pnpm exec playwright test --project chromium-ci' pnpm run codex:issue -- 7

- Change the repair loop limit:

      CODEX_ISSUE_MAX_ATTEMPTS=5 pnpm run codex:issue -- 7

- Dry-run the harness without Codex, git push, CI watch, comments, or issue close:

      CODEX_ISSUE_DRY_RUN=true pnpm run codex:issue -- 7

### AI Agent QA Workflows

This repository supports specialized AI-agent-driven QA workflows for Playwright TypeScript automation. The canonical
agent prompts live in `.github/agents/`, reusable task prompts live in `.github/prompts/`, and the human-readable workflow
guide lives in `docs/agents/README.md`.

Use the smallest agent that matches the task:

| Task | Agent |
| --- | --- |
| Create or update a test plan | `.github/agents/playwright-test-planner.agent.md` |
| Write a Playwright test from a plan | `.github/agents/playwright-test-generator.agent.md` |
| Debug or fix a failed test | `.github/agents/playwright-test-healer.agent.md` |
| Improve fixtures, helpers, page objects, config, data, or reporting | `.github/agents/framework-engineer.agent.md` |
| Repair or improve CI/CD | `.github/agents/cicd-repair.agent.md` |
| Reduce flaky behavior | `.github/agents/stability-flakiness.agent.md` |
| Optimize test or pipeline runtime | `.github/agents/performance-agent.agent.md` |
| Review tests or framework architecture | `.github/agents/playwright-test-reviewer.agent.md` |
| Verify changes before reporting completion | `.github/agents/verification-agent.agent.md` |

Reusable prompt examples:

```text
Use .github/prompts/create-test-plan.prompt.md. Create a test plan for <feature> with these acceptance criteria: <criteria>.
```

```text
Use .github/prompts/write-playwright-test.prompt.md. Implement Plan ID <PLAN-ID> from <spec path>.
```

```text
Use .github/prompts/debug-failed-test.prompt.md. Debug <test file or title>. Error output: <error>.
```

```text
Use .github/prompts/review-playwright-test.prompt.md. Review <file> for reliability, maintainability, Playwright best practices, and plan sync.
```

```text
Use .github/prompts/verify-changes.prompt.md. Verify the current changes and report commands, results, unverified items, and ready status.
```

Plan/test synchronization rules:

- Every planned scenario needs a stable `Plan ID` and `Automation` line.
- Every generated Playwright spec needs top-of-file `// spec:` and `// plan-id:` comments.
- When a test is created, moved, renamed, repaired, or deleted, update the linked plan in the same change.
- Run `npm run plan-coverage` before reporting automation work complete.
- Do not hide failures by deleting tests, skipping tests, weakening assertions, or adding arbitrary waits.

Recommended verification:

```sh
npm run plan-coverage
pnpm exec playwright test --list --project chromium-ci
pnpm exec playwright test tests/seed.spec.ts tests/test.spec.ts --project chromium-ci
```

There are currently no repository scripts for lint or TypeScript type-checking. Do not claim lint/typecheck coverage
unless those scripts are added and run.

### Usage

	1.	Write Tests: Add your tests under the tests directory (or any directory you define).
	2.	Run Tests: Use any of the scripts above to execute tests according to your requirements.
	3.	Debug Tests: Use UI mode or headed mode to debug your tests with visual feedback.

### Running Tests

#### 1.	Run all tests:

    pnpm run example


#### 2.	Run tests in a specific browser:
You can specify the browser by setting the --project flag with chromium, firefox, or webkit. Example:

    pnpm exec playwright test --project firefox

#### 3.	Run tests in UI mode:
Launch UI mode to get an interactive view:

    pnpm run test-ui-mode


#### 4.	Run a specific test file:

    pnpm exec playwright test path/to/test.spec.js


#### 5.	Debugging in headed mode:
To see tests running in real-time, run them in headed mode:

    pnpm exec playwright test --headed


### Test Reporting

After running tests, Playwright automatically generates a test report, which can be viewed in a browser:

    pnpm run report

This opens an HTML report where you can view results, screenshots, and logs for each test.

Additional Playwright Commands

Here are some additional useful commands for working with Playwright:

#### Install new browsers:
If a specific browser version is needed, install it with:

    pnpm exec playwright install <browser-name>


#### Update Playwright:
To update Playwright to the latest version, run:

    pnpm update @playwright/test


### Contributing

Contributions are welcome! If you’d like to add new features, fix issues, or improve documentation, please open a pull request or submit an issue in the repository.

### License

This project is licensed under the ISC License. See the LICENSE file for details.

Feel free to customize this README as your project evolves!
