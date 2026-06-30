# Create Test Plan Prompt

Use `.github/agents/playwright-test-planner.agent.md`.

## Input

- Feature description
- Acceptance criteria
- Affected product area or URL
- Risk level, if known
- Auth, data, environment, or browser constraints

## Workflow

1. Inspect existing plans in `specs/` for naming, Plan ID prefixes, and coverage style.
2. Inspect existing tests in `tests/` only to understand current automation patterns.
3. Explore the application with Playwright MCP tools when product behavior is not fully specified.
4. Create or update a markdown plan under `specs/`.
5. Assign stable `Plan ID` values and initialize `**Automation:** Not automated`.
6. Add risk, coverage type, assumptions, data needs, and expected results.
7. Identify automation candidates and manual/exploratory cases.

## Output

- Test plan path
- Scenario summary
- Automation candidates
- Manual/exploratory coverage
- Required framework support
- Open questions or assumptions

## Verification

- Confirm every scenario has `Plan ID` and `Automation`.
- Do not run Playwright automation unless the task also includes implementation.
