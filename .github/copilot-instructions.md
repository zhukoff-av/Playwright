# GitHub Copilot Agent Instructions

This repository uses specialized Playwright QA agents. Treat `.github/agents/` as the canonical source of agent
instructions and `.github/prompts/` as reusable workflow prompts.

## Route Tasks

- Test plan: `.github/agents/playwright-test-planner.agent.md`
- Playwright test generation: `.github/agents/playwright-test-generator.agent.md`
- Failed test debugging or repair: `.github/agents/playwright-test-healer.agent.md`
- Framework fixtures/helpers/page objects/config/reporting: `.github/agents/framework-engineer.agent.md`
- CI repair or CI improvement: `.github/agents/cicd-repair.agent.md`
- Flakiness reduction: `.github/agents/stability-flakiness.agent.md`
- Performance optimization: `.github/agents/performance-agent.agent.md`
- Test or framework review: `.github/agents/playwright-test-reviewer.agent.md`
- Final verification: `.github/agents/verification-agent.agent.md`

## Required Rules

- Preserve plan/test synchronization between `specs/` and `tests/`.
- Generated specs must include `// spec:` and `// plan-id:` metadata.
- Update the plan `Automation` line whenever creating, moving, renaming, repairing, or deleting a Playwright test.
- Run `npm run plan-coverage` before reporting test automation work complete.
- Do not hide failures by deleting tests, skipping tests, weakening assertions, or adding arbitrary waits.
- Do not claim lint or type-check success unless scripts are added and run.
- Do not close or report a linked GitHub issue complete until the fix is committed, pushed, and GitHub Actions is green
  for the pushed commit.
- Use `docs/agents/README.md` for the human-readable workflow guide.
