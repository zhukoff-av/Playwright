# Improve CI Prompt

Use `.github/agents/cicd-repair.agent.md`.

## Input

- CI failure, slow pipeline, weak reporting, missing artifact, or reproducibility issue
- Failing run/check URL if available
- Expected local equivalent command

## Workflow

1. Inspect `.github/workflows/`, `package.json`, `playwright.config.ts`, and reporting scripts.
2. For failures, identify the first actual failure from logs before changing files.
3. For improvements, baseline the current behavior and choose one measurable bottleneck or visibility gap.
4. Reproduce locally where possible.
5. Apply the smallest CI or script change.
6. Do not skip tests or disable checks.
7. If Playwright tests changed, use the reviewer workflow.

## Output

- Diagnosis or improvement rationale
- Implemented CI change
- Local reproduction command
- Artifact/reporting impact
- Verification result
- Remote CI validation status or limitation
