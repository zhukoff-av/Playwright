# Claude Code Instructions

Use the agent router in `AGENTS.md` and the canonical agent prompts in `.github/agents/`.

## Routing

- Planning work: `.github/agents/playwright-test-planner.agent.md`
- Test writing: `.github/agents/playwright-test-generator.agent.md`
- Test debugging/fixing: `.github/agents/playwright-test-healer.agent.md`
- Framework implementation: `.github/agents/framework-engineer.agent.md`
- CI/CD work: `.github/agents/cicd-repair.agent.md`
- Flakiness work: `.github/agents/stability-flakiness.agent.md`
- Performance work: `.github/agents/performance-agent.agent.md`
- Review work: `.github/agents/playwright-test-reviewer.agent.md`
- Verification: `.github/agents/verification-agent.agent.md`

Reusable prompt workflows live in `.github/prompts/`.

## Repository Rules

- Test plans live in `specs/`.
- Playwright tests live in `tests/`.
- New generated tests must include `// spec:` and `// plan-id:` metadata.
- Every planned scenario must include a stable `Plan ID` and `Automation` line.
- Keep plan `Automation` lines synchronized with test file changes.
- Run `npm run plan-coverage` for test-plan synchronization.
- Do not skip, delete, or weaken tests to make the suite green.
- Do not add arbitrary waits or use `networkidle` as a default synchronization strategy.
- For linked GitHub issues, use the ship gate: fix, local eval, commit, push, check CI for the pushed commit, then close
  the issue only if CI is green.
