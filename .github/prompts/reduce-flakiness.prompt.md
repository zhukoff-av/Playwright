# Reduce Flakiness Prompt

Use `.github/agents/stability-flakiness.agent.md`.

## Input

- Flaky test, flaky pattern, CI run, or failure history
- Trace/screenshot/video/log evidence if available
- Affected environment

## Workflow

1. Gather evidence and reproduce the smallest flaky scope.
2. Classify the flaky pattern: timing, selector, data, isolation, environment, CI, product instability, or unclear.
3. Replace fragile waits/selectors/shared state with deterministic synchronization and isolated data.
4. Avoid sleeps, broad retries, skipped tests, and weakened assertions.
5. Review modified Playwright tests.
6. Rerun affected tests repeatedly enough to support the stability claim.
7. Run plan coverage when test files or plans changed.
8. For linked issue work, hand off to the ship gate: local evals, commit, push, CI watch, repair if needed, and close only
   after green CI.

## Output

- Flaky pattern and evidence
- Root cause
- Stable fix
- Before/after behavior
- Verification command, repeat count, and results
- Ship-gate status for linked issues
- Remaining risk
