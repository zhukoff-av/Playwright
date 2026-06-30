# Optimize Performance Prompt

Use `.github/agents/performance-agent.agent.md`.

## Input

- Slow test, slow suite, slow CI topic, or performance goal
- Baseline command or report if available
- Constraints around coverage and stability

## Workflow

1. Establish a before measurement with the same command that will be used after the change.
2. Identify the bottleneck: setup, auth, data, navigation, test body, browser install, artifact upload, or CI matrix.
3. Apply one safe optimization.
4. Preserve assertions, coverage, isolation, and debuggability.
5. Review modified Playwright tests, if any.
6. Rerun the same command and compare.
7. Run plan coverage when tests or plans changed.

## Output

- Baseline command and runtime/result
- Bottleneck
- Optimization
- After command and runtime/result
- Coverage/stability impact
- Follow-ups
