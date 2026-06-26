# DemoQA Text Box Page Test Plan

**Seed:** `tests/seed.spec.ts`

## Scope

Validate that the DemoQA Text Box page at `https://demoqa.com/text-box` loads with the expected browser title and visible page heading.

## Assumptions

- Each scenario starts from a fresh browser context.
- The DemoQA Text Box page is publicly reachable.
- The page browser title should contain `Text Box`.
- The page should expose a visible heading named `Text Box`.

## Scenarios

### 1. Verify Text Box Page Title and Heading

1. Open `https://demoqa.com/text-box`.
2. Validate that the page has a visible heading `Text Box`.
3. Validate that the browser page title contains `Text Box`.

Expected result: the page loads successfully, the browser title contains `Text Box`, and the `Text Box` heading is visible.
