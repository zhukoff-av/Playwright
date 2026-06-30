# QA Agent Workflows

This repository supports AI-agent-driven QA automation through specialized prompts in `.github/agents/`. Use those files
as the source of truth for Codex, Claude Code, Cursor, GitHub Copilot Agent, and similar coding agents.

## Framework Review Summary

- Playwright config lives in `playwright.config.ts`.
- Test plans live in `specs/`.
- Automated tests live in `tests/`.
- Generated specs must include `// spec:` and `// plan-id:` metadata.
- Plans and tests are synchronized with `npm run plan-coverage`.
- Newer tests use domain/feature folders and typed fixtures.
- Some legacy/root specs still exist and should not be moved unless a cleanup task explicitly requires it.
- Archived Alloy tests are ignored by Playwright execution but still referenced by plans for coverage accounting.
- CI runs a topic matrix in `.github/workflows/main.yml` and publishes JSON/HTML Playwright artifacts.
- There are no repository scripts for lint or TypeScript type-checking yet.

Stable areas:
- Plan ID convention.
- Plan coverage script.
- Playwright MCP configuration.
- CI report summary and artifacts.
- Review gate for generated or repaired tests.

Risk areas:
- Mixed legacy and domain/feature test organization.
- Some archived tests contain unstable patterns such as fixed waits or `networkidle`.
- Environment validation and test data builders are minimal.
- Broad framework architecture guidance was previously spread across multiple files.
- No lint/typecheck scripts are available.

## Existing Agent Review

Existing agents before this expansion:

- `playwright-test-planner`: creates markdown test plans with Plan IDs and automation status.
- `playwright-test-generator`: writes Playwright specs from plans and updates plan automation links.
- `playwright-test-healer`: debugs and repairs failing Playwright tests.
- `playwright-test-reviewer`: reviews Playwright tests for quality, reliability, and maintainability.
- `cicd-repair`: investigates and repairs CI/CD failures.

Added agents:

- `framework-engineer`: owns fixtures, helpers, page objects, API clients, test data, config, and reporting improvements.
- `stability-flakiness`: owns flaky pattern diagnosis and deterministic stabilization.
- `performance-agent`: owns runtime measurement and safe optimization.
- `verification-agent`: owns final validation evidence and ready/not-ready status.

## Agent Capability Matrix

| Capability | Existing support | Missing or weak area | Recommended agent |
| --- | --- | --- | --- |
| Test planning | Yes | Risk mapping and API/UI/e2e coverage needed stronger rules | `playwright-test-planner` |
| Test writing | Yes | Structure, fixture, locator, and sync rules needed clearer enforcement | `playwright-test-generator` |
| Test debugging | Partial | Failure classification was incomplete | `playwright-test-healer` |
| Framework feature implementation | No | No dedicated owner for shared framework changes | `framework-engineer` |
| CI improvement | Partial | Repair existed; proactive improvement needed clearer workflow | `cicd-repair` |
| Performance optimization | No | No measurement-first workflow | `performance-agent` |
| Flakiness reduction | Partial | Healer handled failures, not proactive flaky pattern cleanup | `stability-flakiness` |
| Test review | Yes | Test-focused review existed | `playwright-test-reviewer` |
| Framework review | Partial | Architecture review was secondary | `playwright-test-reviewer` |
| Verification | Partial | No dedicated final evidence gate | `verification-agent` |

## Master Router

| Need | Agent |
| --- | --- |
| New feature test plan | `.github/agents/playwright-test-planner.agent.md` |
| Test from existing plan | `.github/agents/playwright-test-generator.agent.md` |
| Failed test debugging or repair | `.github/agents/playwright-test-healer.agent.md` |
| Framework fixture/helper/config/reporting change | `.github/agents/framework-engineer.agent.md` |
| CI failure or CI improvement | `.github/agents/cicd-repair.agent.md` |
| Flaky test or fragile pattern | `.github/agents/stability-flakiness.agent.md` |
| Slow test, suite, or pipeline | `.github/agents/performance-agent.agent.md` |
| Test or framework review | `.github/agents/playwright-test-reviewer.agent.md` |
| Final validation | `.github/agents/verification-agent.agent.md` |

Default loop:

1. Understand the task.
2. Select the correct agent.
3. Inspect relevant code, plans, config, workflows, and docs.
4. Make a small plan.
5. Implement the minimal safe change.
6. Run verification.
7. Report evidence.
8. Recommend the next step.

## Agent Loop Stack

Implementation and repair agents must use this loop:

```text
trace every run -> judge with an LLM -> diagnose -> fix -> validate -> commit -> push -> check CI -> repair if needed -> close issue only when CI is green
```

- Trace every run with local command logs, Playwright traces, CI logs, run URLs, and attempt summaries.
- Judge the trace before making the next change.
- Diagnose the root cause and classify failures clearly.
- Fix only the smallest safe scope.
- Use the harness for evals, commit, push, CI watch, and issue close.
- Keep memory across attempts: issue metadata, attempts, commits, pushed refs, local eval summaries, CI URLs, diagnoses,
  and failed approaches.
- Run evals locally before commit and in GitHub Actions after push.
- Ship only after the pushed commit has green CI.

For `pnpm run codex:issue`, `scripts/codex-issue.sh` enforces this gate. A linked GitHub issue must remain open if local
validation fails, commit fails, push fails, CI fails, or no CI run can be verified for the pushed commit.

## Reusable Workflows

### New Feature Test Plan Workflow

Input:
- feature description
- acceptance criteria
- affected area
- risk level

Output:
- test plan under `specs/`
- automation candidates
- manual/exploratory cases
- data requirements
- required framework support

Prompt file: `.github/prompts/create-test-plan.prompt.md`

### New Playwright Test Workflow

Input:
- test plan or acceptance criteria
- target Plan ID
- existing framework patterns

Output:
- implemented test
- updated fixtures/helpers if needed
- updated plan `Automation` line
- reviewer and verification result

Prompt file: `.github/prompts/write-playwright-test.prompt.md`

### Failed Test Debugging Workflow

Input:
- failed test name
- error output
- trace/screenshot/video if available
- environment

Output:
- root cause
- failure classification
- fix or blocker
- verification result

Prompt file: `.github/prompts/debug-failed-test.prompt.md`

### Framework Improvement Workflow

Input:
- pain point or improvement idea

Output:
- proposed change
- implemented framework improvement
- affected files
- verification result

Prompt file: `.github/prompts/improve-framework.prompt.md`

### CI Improvement Workflow

Input:
- CI failure, slow pipeline, or missing reporting

Output:
- diagnosis
- CI improvement
- reproduction command
- artifacts/reporting update
- verification result

Prompt file: `.github/prompts/improve-ci.prompt.md`

### Flakiness Reduction Workflow

Input:
- flaky test or flaky pattern

Output:
- root cause
- stable fix
- before/after behavior
- verification result

Prompt file: `.github/prompts/reduce-flakiness.prompt.md`

### Performance Optimization Workflow

Input:
- slow test, suite, or pipeline

Output:
- bottleneck
- optimization
- before/after measurement when possible
- verification result

Prompt file: `.github/prompts/optimize-performance.prompt.md`

### Review Workflow

Input:
- test file, PR, framework module, or whole repo area

Output:
- critical issues
- important improvements
- nice-to-have improvements
- recommended actions

Prompt file: `.github/prompts/review-playwright-test.prompt.md`

### Verification Workflow

Input:
- changed files or summary of work

Output:
- commands run
- results
- failure classification, if any
- unverified items
- ready/not-ready status

Prompt file: `.github/prompts/verify-changes.prompt.md`

## Verification Rules

Every agent must:

- Run verification before claiming success, or explain why verification could not run.
- Prefer the smallest relevant test scope first.
- Run broader validation for framework-level, config-level, or CI-level changes.
- Report commands and results.
- Classify failures clearly.
- Avoid hiding failures with skips, deleted tests, weakened assertions, or arbitrary waits.
- Keep plans and tests synchronized with `npm run plan-coverage`.

Recommended commands:

```sh
npm run plan-coverage
pnpm exec playwright test --list --project chromium-ci
pnpm exec playwright test tests/seed.spec.ts tests/test.spec.ts --project chromium-ci
```

## Copy-Paste Prompts

Create a test plan:

```text
Use .github/prompts/create-test-plan.prompt.md. Create a test plan for <feature> with these acceptance criteria: <criteria>.
```

Write a test:

```text
Use .github/prompts/write-playwright-test.prompt.md. Implement Plan ID <PLAN-ID> from <spec path>.
```

Debug a failure:

```text
Use .github/prompts/debug-failed-test.prompt.md. Debug <test file or title>. Error output: <error>.
```

Review a test:

```text
Use .github/prompts/review-playwright-test.prompt.md. Review <file> for reliability, maintainability, Playwright best practices, and plan sync.
```

Verify changes:

```text
Use .github/prompts/verify-changes.prompt.md. Verify the current changes and report commands, results, unverified items, and ready status.
```
