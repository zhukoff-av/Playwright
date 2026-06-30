# Agent Instructions

This repository uses specialized QA automation agents for Playwright TypeScript work. The canonical agent prompts live in
`.github/agents/`. Cross-tool files for Codex, Claude Code, Cursor, and GitHub Copilot should route back to those prompts
instead of copying their full contents.

## Repository Snapshot

- Playwright config: `playwright.config.ts`
- Test plans: `specs/`
- Automated tests: `tests/`
- Default seed test: `tests/seed.spec.ts`
- Agent prompts: `.github/agents/`
- Reusable task prompts: `.github/prompts/`
- Playwright MCP server: `.vscode/mcp.json`
- Plan/test coverage check: `npm run plan-coverage`

## Master Agent Router

Use the smallest specialized agent that matches the work:

| Task | Use agent |
| --- | --- |
| Create or update a human-readable test plan | `.github/agents/playwright-test-planner.agent.md` |
| Generate a Playwright test from an approved plan | `.github/agents/playwright-test-generator.agent.md` |
| Run, debug, classify, and fix a failing Playwright test | `.github/agents/playwright-test-healer.agent.md` |
| Implement fixtures, helpers, page objects, API clients, config, or reporting improvements | `.github/agents/framework-engineer.agent.md` |
| Investigate or repair GitHub Actions failures | `.github/agents/cicd-repair.agent.md` |
| Improve CI speed, artifacts, caching, sharding, or reproducibility | `.github/agents/cicd-repair.agent.md` |
| Reduce flaky behavior or fragile synchronization | `.github/agents/stability-flakiness.agent.md` |
| Measure and improve suite or test runtime | `.github/agents/performance-agent.agent.md` |
| Review Playwright tests or framework architecture | `.github/agents/playwright-test-reviewer.agent.md` |
| Confirm changes are ready to report or publish | `.github/agents/verification-agent.agent.md` |

Default loop for every agent:

1. Understand the task and select the correct agent.
2. Inspect relevant code, plans, config, workflows, and docs before editing.
3. Make a small implementation plan.
4. Apply the minimal safe change.
5. Run the smallest relevant verification first.
6. Run broader checks for framework-level or CI-level changes.
7. Report commands, results, failures, and remaining risks.
8. Recommend the next step only after evidence is collected.

## Agent Loop Stack

All implementation and repair workflows use this loop:

`trace every run -> judge with an LLM -> diagnose -> fix -> validate -> commit -> push -> check CI -> repair if needed -> close only when CI is green`

- Trace: keep command output, Playwright traces, CI logs, run URLs, and repair attempts.
- Judge: review the trace before changing code; do not repeat failed fixes.
- Diagnose: classify the failure as product, test, framework, data, environment, CI, flaky timing, or unclear.
- Fix: apply the smallest safe code or workflow change.
- Harness: let the wrapper or verification workflow own evals, commit, push, CI watch, and issue close.
- Evals: run local checks before commit and GitHub Actions checks after push.
- Memory: carry issue details, attempts, commits, logs, CI URLs, diagnoses, and rejected fixes into the next attempt.
- Ship: a linked GitHub issue is complete only after the fix is committed, pushed, and required CI is green.

## Capability Matrix

| Capability | Existing support | Missing or weak area | Recommended agent |
| --- | --- | --- | --- |
| Test planning | Yes | Risk mapping and API/UI/e2e coverage must be explicit | `playwright-test-planner` |
| Test writing | Yes | Must enforce plan sync, one scenario per spec, stable locators, and fixture patterns | `playwright-test-generator` |
| Test debugging | Partial | Must classify root cause before fixing | `playwright-test-healer` |
| Framework feature implementation | No | Needs fixture/helper/config/reporting ownership | `framework-engineer` |
| CI improvement | Partial | Repair exists; proactive optimization must be evidence-based | `cicd-repair` |
| Performance optimization | No | Needs measurement-first runtime workflow | `performance-agent` |
| Flakiness reduction | Partial | Needs pattern search and deterministic replacement workflow | `stability-flakiness` |
| Test review | Yes | Must separate critical defects from improvements | `playwright-test-reviewer` |
| Framework review | Partial | Must review boundaries, duplication, and scalability | `playwright-test-reviewer` |
| Verification | Partial | Needs final evidence gate | `verification-agent` |

## Test Plan Synchronization

- Every test-plan scenario must have a stable `Plan ID` before automation is generated.
- Use readable IDs with a product or feature prefix and a three-digit number, such as `DEMOQA-TEXT-BOX-002`.
- Every scenario must include one automation line:
  - `**Automation:** Not automated`
  - `**Automation:** Automated in `tests/path/to/scenario.spec.ts``
- Every generated Playwright spec must include metadata comments at the top:
  - `// spec: specs/path-to-plan.md`
  - `// plan-id: PLAN-ID`
- One generated spec should map to exactly one planned scenario unless the user explicitly asks for a combined test or an
  existing combined legacy spec is being maintained.
- When creating, moving, renaming, repairing, or deleting a Playwright test, update the corresponding `Automation` line in
  the same change.
- Before reporting completion, run `npm run plan-coverage` or manually compare plan IDs in `specs/` with `// plan-id:`
  comments in `tests/`.

## Verification Rules

Every agent must follow these rules:

- Do not claim success without running verification or explaining why verification could not run.
- Prefer the smallest relevant test scope first.
- Run broader validation for framework-level, CI-level, or shared fixture/helper changes.
- Always report commands run and results.
- Classify failures clearly.
- Do not hide failing tests.
- Do not delete tests to make the suite green.
- Do not weaken assertions without explaining the behavior contract.
- Do not replace real validation with snapshots unless justified.
- Do not add arbitrary waits unless absolutely necessary and documented.
- Do not use `networkidle` as a default synchronization strategy.

Recommended validation commands:

```sh
npm run plan-coverage
pnpm exec playwright test --list --project chromium-ci
pnpm exec playwright test tests/seed.spec.ts tests/test.spec.ts --project chromium-ci
```

There are currently no repository scripts for lint or TypeScript type-checking. Agents must not claim lint/typecheck
coverage unless those commands are added and run.

## Review Gate

- Any newly added Playwright test must be reviewed with `.github/agents/playwright-test-reviewer.agent.md`.
- Any Playwright test modified by the healer, stability, framework, performance, or CI/CD workflow must be reviewed.
- Do not treat a generated or repaired test as complete until reviewer findings are resolved or documented as
  non-actionable.

## Publish Gate

- After generated or repaired tests pass review and affected tests are rerun, stage relevant changes, create a commit, and
  push the current branch automatically when the user asks for issue/PR completion.
- If there is no upstream branch, push with upstream tracking for the current branch.
- If commit or push fails, report the failure and leave the linked GitHub issue open.
- Closing a GitHub issue before pushing the fix is forbidden.

## CI Status Gate

- After each automatic push, check GitHub Actions runs or PR checks for the pushed commit.
- If required CI fails, invoke `.github/agents/cicd-repair.agent.md` immediately.
- Do not close a linked issue or report it complete until required CI passes, or until a product defect or external CI
  infrastructure failure is identified and documented.
- Local validation alone is never enough to close a linked GitHub issue.

## Repository Assessment for Agents

- The current framework is small and sample-oriented, with mature plan metadata and CI reporting.
- Newer tests use domain/feature folders and typed fixtures, while some legacy/root specs remain for historical coverage.
- Archived Alloy tests are ignored by Playwright config but still linked from test plans for coverage accounting.
- Test data is mostly inline; environment handling is minimal and should be improved only through the framework engineer.
- CI runs a topic matrix and publishes JSON/HTML artifacts using `scripts/playwright-summary.js`.
- Known risks include no lint/typecheck scripts, mixed test organization, archived flaky patterns, and no central config
  validation.

Do not treat `.github/agents/*.agent.md` as GitHub-only files. They are source prompts for Codex, Claude Code, Cursor,
GitHub Copilot Agent, and similar coding agents.
