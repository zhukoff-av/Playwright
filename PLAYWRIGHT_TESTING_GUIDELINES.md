# Playwright Testing Guidelines

This document describes Playwright testing practices used by mature engineering teams. Tests should be stable, readable, maintainable, and useful for fast failure diagnosis.

## 1. Test user scenarios

A good E2E test describes product behavior from the user's point of view, not implementation details.

Write tests around scenarios:

- a user signs in;
- a user creates a ticket;
- a user filters the catalog;
- a user opens a knowledge base article;
- a user sees an error for invalid data.

Avoid tests that verify only DOM structure, CSS classes, or technical component details unless those details are an explicit product contract.

## 2. One test, one reason to fail

A test should verify one complete scenario or one important rule. If a test checks too many unrelated things, failures become hard to diagnose.

Bad:

```ts
test("portal works", async ({ page }) => {
  // login
  // create ticket
  // search knowledge base
  // open catalog
  // check dashboard
});
```

Good:

```ts
test("user can create a technical issue ticket", async ({ page }) => {
  // focused scenario
});
```

## 3. Page Object

Use Page Objects to encapsulate actions and locators for a specific page or a large UI area.

Page Objects help you:

- avoid duplicated locators;
- give actions business meaning;
- simplify test maintenance when the UI changes;
- keep spec files short and readable.

Example structure:

```ts
export class LoginPage {
  constructor(private readonly page: Page) {}

  readonly userNameInput = this.page.getByRole("textbox", { name: "User Name" });
  readonly passwordInput = this.page.getByRole("textbox", { name: "Password" });
  readonly signInButton = this.page.getByRole("button", { name: "Sign in" });

  async open() {
    await this.page.goto("/hd");
  }

  async signIn(userName: string, password: string) {
    await this.userNameInput.fill(userName);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
```

A spec file should read like a scenario:

```ts
test("user can sign in with valid credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.signIn(alloyUser, alloyPassword);

  await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
});
```

Rule: a Page Object should not become a dumping ground for the whole project. Create separate objects for pages, modals, widgets, and large components.

## 4. DRY, but avoid excessive abstractions

DRY means not copying the same behavior, locators, and setup code across multiple tests.

Extract:

- repeated login/setup logic;
- common user actions;
- frequently used assertions;
- test data preparation;
- API helpers;
- stable page locators.

But do not create an abstraction for a single line. Readability matters in tests. Sometimes an explicit step in a spec file is better than an overly generic helper.

A good rule of thumb: if the same code appears 3 times with the same meaning, extract it.

## 5. Use user-facing locators

Preferred locator order:

1. `getByRole`
2. `getByLabel`
3. `getByPlaceholder`
4. `getByText`, if the text is a user-facing contract
5. `getByTestId`, when an element is hard to select in a user-facing way
6. CSS/XPath only as a last resort

Good:

```ts
await page.getByRole("button", { name: "Sign in" }).click();
```

Bad:

```ts
await page.locator(".btn-primary:nth-child(2)").click();
```

If the UI changes often, align with developers on stable `data-testid` attributes for critical elements.

## 6. Do not use fixed timeouts

Avoid `waitForTimeout`. Fixed sleeps make tests slower and less stable.

Bad:

```ts
await page.waitForTimeout(3000);
```

Good:

```ts
await expect(page.getByRole("heading", { name: "My Tickets" })).toBeVisible();
```

Wait for product state: visibility, URL, network response, loader disappearance, or result appearance.

## 7. Assertions must be explicit

Every test should finish by verifying a result that matters to the user or the business.

Good:

```ts
await expect(page.getByText("Ticket submitted successfully")).toBeVisible();
await expect(page.getByRole("link", { name: ticketTitle })).toBeVisible();
```

Bad:

```ts
await page.getByRole("button", { name: "Submit" }).click();
```

A click without a result assertion does not prove that the scenario works.

## 8. Tests must be independent

A test should not depend on the result of another test. Each test should prepare the state it needs or use shared setup.

Use:

- `beforeEach` for local preparation;
- `globalSetup` or `*.setup.ts` for authentication;
- API calls to create data when they are faster and more stable than UI steps;
- unique test data names.

Do not rely on test execution order. In CI, tests can run in parallel, in a different order, or more than once.

## 9. Test data must be controlled

In large teams, unstable data often breaks E2E tests more than the UI itself.

Recommendations:

- create data through an API when possible;
- use unique names with a timestamp or `testInfo.workerIndex`;
- clean up data after the test if it pollutes the environment;
- do not use real user accounts;
- store secrets in environment variables, not in code.

## 10. Authentication should be fast

Do not sign in through the UI in every test unless login itself is the thing being tested.

For most scenarios, it is better to:

- authenticate once in a setup file;
- save `storageState`;
- reuse that state in tests.

UI login is needed for login tests. Other scenarios should start already authenticated.

## 11. Tests must work well in CI

A test may pass locally while CI is slower and stricter.

Rules:

- do not depend on animation speed;
- do not rely on local browser state;
- do not rely on test execution order;
- keep traces, screenshots, and videos for failure diagnosis;
- verify tests in headless mode;
- do not make tests longer than necessary.

## 12. Use `test.step`

`test.step` makes reports easier to read. It is especially useful in longer business scenarios.

```ts
await test.step("Open technical issue form", async () => {
  await dashboard.openTechnicalIssueForm();
});

await test.step("Submit required fields", async () => {
  await issueForm.submit({
    title,
    description,
    priority: "High",
  });
});
```

Good step names help you quickly understand where a test failed.

## 13. Avoid conditional logic in tests

A test should be predictable. If it contains many `if` statements, it may verify different scenarios in different runs.

Bad:

```ts
if (await page.getByText("Skip").isVisible()) {
  await page.getByText("Skip").click();
}
```

Sometimes defensive logic is acceptable for external popups or unstable overlays, but it should be extracted into a helper and named clearly.

## 14. Use APIs when the UI is not the subject

If a test verifies creating a ticket through a form, the ticket should be created through the UI.

But if a test verifies the ticket list, the ticket can be created beforehand through an API. This is faster and more reliable.

Rule: use the UI for what you are actually testing. Prepare everything else in the most stable way available.

## 15. Test names should describe behavior

A test name should answer the question: what can the user do, or what rule is being verified?

Good:

```ts
test("user sees validation errors when required ticket fields are empty", async ({ page }) => {});
```

Bad:

```ts
test("ticket test 1", async ({ page }) => {});
```

## 16. Separate test levels

Not everything needs to be verified through E2E tests.

Use E2E for:

- critical user journeys;
- frontend, backend, and authentication integration;
- scenarios where real browser behavior matters.

Do not use E2E for:

- every validation variant;
- every small branch of business logic;
- pure function checks;
- exhaustive testing.

Use unit, integration, or component tests for smaller logic.

## 17. Minimize flakiness

Common causes of flaky tests:

- fixed waits;
- unstable selectors;
- dependency on external data;
- parallel tests modifying the same data;
- clicking before the UI is ready;
- not waiting for the result after an action;
- random popups or overlays in the environment.

If a test is flaky, fix the cause instead of only increasing the timeout.

## 18. File structure

Recommended structure:

```text
tests/
  alloy/
    pages/
      login.page.ts
      dashboard.page.ts
      ticket-form.page.ts
    components/
      header.component.ts
      assistant.component.ts
    fixtures/
      alloy.fixtures.ts
    sign-in-with-valid-demo-user.spec.ts
    create-a-technical-issue-ticket.spec.ts
    browse-knowledge-base-articles.spec.ts
```

Spec files own scenarios. Page Objects and component files own UI interaction details.

## 19. Code review checklist

Before merging, check that:

- the test verifies real user behavior;
- the test has explicit assertions;
- there is no `waitForTimeout`, except in rare justified cases;
- locators are stable and user-facing;
- repeated code has been extracted;
- Page Objects do not contain unnecessary business logic;
- the test is independent from other tests;
- data is unique or controlled;
- the test passes locally and in CI;
- a failure will be understandable from the trace/report.

## 20. The main rule

A Playwright test should read like a good instruction for a human: open the page, perform clear actions, see the expected result.

If a test is hard to read, hard to fix, or hard to explain, simplify it.
