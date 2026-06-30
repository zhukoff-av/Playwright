# Review Playwright Test Prompt

Use `.github/agents/playwright-test-reviewer.agent.md`.

## Input

- Test file, framework module, PR diff, or repository area to review
- Context for intended behavior
- Whether review should be test-focused, framework-focused, or both

## Workflow

1. Inspect the changed files and relevant surrounding code.
2. Confirm plan/test metadata synchronization for Playwright specs.
3. Check reliability, Playwright best practices, test design, maintainability, architecture, performance, and CI readiness.
4. Separate critical defects from important improvements and nice-to-have follow-ups.
5. Run focused commands only when they materially validate a review finding.

## Output

- Findings ordered by severity
- File and line references where possible
- Why each issue matters
- Recommended solution
- Quality score
- Critical fixes, important improvements, and nice-to-have follow-ups

## Verification

- Do not edit code unless explicitly asked.
- State which commands were or were not run.
