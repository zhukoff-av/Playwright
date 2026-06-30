# Improve Framework Prompt

Use `.github/agents/framework-engineer.agent.md`.

## Input

- Framework pain point or improvement idea
- Affected tests or product area
- Constraints around compatibility, scope, or rollout

## Workflow

1. Inspect existing fixtures, page objects, helpers, scripts, config, and guidelines.
2. Choose the smallest design that fits current repository patterns.
3. Implement focused improvements to fixtures, helpers, page objects, API clients, test data, env config, reporting, or
   diagnostics.
4. Avoid broad rewrites and unrelated test movement.
5. Review changed Playwright tests if any were modified.
6. Run affected tests and plan coverage.
7. For linked issue work, hand off to the ship gate: local evals, commit, push, CI watch, repair if needed, and close only
   after green CI.

## Output

- Problem
- Design choice
- Files changed
- Verification commands and results
- Reviewer outcome, if applicable
- Ship-gate status for linked issues
- Risks and follow-ups
