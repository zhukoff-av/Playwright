# Agent Instructions

This repository uses Playwright Test Agents through the `playwright-test` MCP server.

When running inside VSCode with the Codex/OpenAI agent plugin:

- Use the MCP server configured in `.vscode/mcp.json`.
- Use `.github/agents/playwright-test-planner.agent.md` as the planner workflow.
- Use `.github/agents/playwright-test-generator.agent.md` as the generator workflow.
- Use `.github/agents/playwright-test-healer.agent.md` as the healer workflow.
- Use `.github/agents/cicd-repair.agent.md` as the CI/CD repair workflow.
- Save human-readable test plans under `specs/`.
- Save generated Playwright tests under `tests/`.
- Use `tests/seed.spec.ts` as the default seed file unless the user specifies another seed.

Preferred workflow:

1. Plan coverage with the planner agent instructions and `playwright-test` MCP tools.
2. Generate one Playwright spec per planned scenario with the generator agent instructions.
3. Run and repair tests with the healer agent instructions until they pass or a real product defect is identified.

CI/CD repair workflow:

1. Investigate failing GitHub Actions logs and identify the first actual failure.
2. Reproduce the failing command locally, using a clean checkout when local state may hide CI-only issues.
3. Apply the minimal correct fix without disabling tests or skipping failing steps.
4. Run the same CI commands locally and repeat affected tests when flakiness is suspected.
5. Report root cause, fix, verification, remaining risks, and follow-up improvements.

Do not treat `.github/agents/*.agent.md` as GitHub-only files. They are the source prompts for Codex workflows in this repo.
