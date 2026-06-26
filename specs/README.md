# Specs

This is a directory for test plans.

## Test Plan to Automation Mapping

Every scenario in a test plan must include:

```markdown
**Plan ID:** `PRODUCT-FEATURE-001`
**Automation:** Not automated
```

When a scenario is automated, update the line to:

```markdown
**Automation:** Automated in `tests/path/to/scenario.spec.ts`
```

Every Playwright spec that automates a planned scenario must include matching metadata at the top of the file:

```ts
// spec: specs/path-to-plan.md
// plan-id: PRODUCT-FEATURE-001
```

Use Plan IDs to answer coverage questions:

- `Automated in ...` means the scenario has a matching Playwright spec.
- `Not automated` means the scenario is planned but not covered by automation yet.
- A `// plan-id:` in `tests/` without a matching scenario in `specs/` is orphaned automation and should be fixed.
