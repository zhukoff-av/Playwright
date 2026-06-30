# Verify Changes Prompt

Use `.github/agents/verification-agent.agent.md`.

## Input

- Changed files or summary of work
- Intended validation level: docs-only, affected tests, framework-level, CI-level, or release-ready

## Workflow

1. Inspect `git status --short` and changed files.
2. Map changes to required checks.
3. Run the smallest relevant verification first.
4. Run broader checks for shared framework, config, or CI changes.
5. For agent docs, search for stale paths, conflicting responsibilities, missing prompts, and incorrect router links.
6. Classify failures clearly and do not mark the work ready if required checks fail.

## Default Commands

```sh
npm run plan-coverage
pnpm exec playwright test --list --project chromium-ci
pnpm exec playwright test tests/seed.spec.ts tests/test.spec.ts --project chromium-ci
```

## Output

- Overall result
- Commands run and results
- Failure classification if any command failed
- Unverified items and why
- Ready/not ready status
