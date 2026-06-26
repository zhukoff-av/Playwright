# Agent Instructions

This repository uses Playwright Test Agents through the `playwright-test` MCP server.

When running inside VSCode with the Codex/OpenAI agent plugin:

- Use the MCP server configured in `.vscode/mcp.json`.
- Use `.github/agents/playwright-test-planner.agent.md` as the planner workflow.
- Use `.github/agents/playwright-test-generator.agent.md` as the generator workflow.
- Use `.github/agents/playwright-test-healer.agent.md` as the healer workflow.
- Save human-readable test plans under `specs/`.
- Save generated Playwright tests under `tests/`.
- Use `tests/seed.spec.ts` as the default seed file unless the user specifies another seed.

Preferred workflow:

1. Plan coverage with the planner agent instructions and `playwright-test` MCP tools.
2. Generate one Playwright spec per planned scenario with the generator agent instructions.
3. Run and repair tests with the healer agent instructions until they pass or a real product defect is identified.

Do not treat `.github/agents/*.agent.md` as GitHub-only files. They are the source prompts for Codex workflows in this repo.
