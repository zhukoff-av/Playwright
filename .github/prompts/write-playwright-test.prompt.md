# Write Playwright Test Prompt

Use `.github/agents/playwright-test-generator.agent.md`.

## Input

- Test plan path
- Plan ID
- Scenario title and steps
- Existing framework patterns to follow

## Workflow

1. Read the target plan and confirm the Plan ID exists.
2. Inspect related specs, fixtures, pages, components, helpers, and `playwright.config.ts`.
3. Execute or inspect the user flow with Playwright MCP tools.
4. Implement one Playwright spec for one scenario unless maintaining an approved combined legacy spec.
5. Include top-of-file metadata:
   - `// spec: specs/path-to-plan.md`
   - `// plan-id: PLAN-ID`
6. Prefer typed fixtures and page/component objects over repeated direct setup.
7. Use stable locators and web-first assertions.
8. Update the plan `Automation` line in the same change.
9. Hand the changed spec to the reviewer workflow.

## Output

- Implemented test path
- Linked plan path and Plan ID
- Reviewer result
- Verification commands and results

## Verification

- Run the affected test.
- Run `npm run plan-coverage`.
- Run broader checks if shared framework code changed.
