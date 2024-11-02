# Playwright


![Build Status](https://github.com/zhukoff-av/Playwright/actions/workflows/main.yml/badge.svg)

This project uses Playwright to automate end-to-end testing for web applications. It includes essential setup, sample scripts, and instructions for running tests in various environments and modes.

Table of Contents

## Table of Contents

- [Project Overview](#project-overview)
- [Installation](#installation)
- [Scripts](#scripts)
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
