# Alloy Login

## Goal

Validate that a user can sign in to Alloy Service and land on the self-service portal.

## Scenario

**Plan ID:** `ALLOY-LOGIN-001`
**Automation:** Automated in `tests/archive/_5/alloy-login.spec.ts`

1. Open `/hd`.
2. Fill the user name and password fields.
3. Submit the login form.
4. Verify the portal is visible after authentication.

## Success Criteria

- The Sign in button is enabled before submit.
- The Self Service Portal content is visible after submit.
- The Find a Solution heading and solution search box are visible.

// THIS IS AN EXPERIMENT BEACH!
