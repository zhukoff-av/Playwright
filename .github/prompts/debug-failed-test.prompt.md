# Debug Failed Test Prompt

Use `.github/agents/playwright-test-healer.agent.md`.

## Input

- Failed test name or file
- Error output
- Trace, screenshot, video, console, or network evidence if available
- Environment: local, CI, browser/project, branch/commit

## Workflow

1. Reproduce with the smallest failing command.
2. Inspect trace, screenshot, video, logs, page snapshot, console, and network evidence.
3. Read the linked plan and the affected spec, fixture, page object, helper, and config.
4. Classify the failure as product bug, test bug, framework bug, test data issue, environment issue, CI issue, flaky
   timing issue, or unclear / needs human decision.
5. Apply the smallest correct fix only when the issue is in automation or framework code.
6. Do not skip, delete, or weaken assertions to make the run green.
7. Review any modified Playwright test with the reviewer workflow.
8. Rerun the affected test and plan coverage.

## Output

- Root cause classification
- Evidence inspected
- Fix or documented blocker
- Reviewer outcome
- Verification commands and results
- Remaining risks
