# DemoQA Text Box Page Test Plan

**Seed:** `tests/seed.spec.ts`

## Scope

Validate the DemoQA Text Box page at `https://demoqa.com/text-box`, including initial page rendering, form field entry, successful submission output, multiline address handling, invalid email validation, and repeated submissions.

## Assumptions

- Each scenario starts from a fresh browser context.
- The DemoQA Text Box page is publicly reachable.
- The page heading should be `Text Box`.
- The form contains fields for full name, email, current address, and permanent address.
- The submit action renders submitted valid data in the output panel.
- Invalid email input is rejected and should not produce an output panel.

## Scenarios

### 1. Verify Text Box Page Renders the Expected Form

**Plan ID:** `DEMOQA-TEXT-BOX-001`
**Automation:** Automated in `tests/demoqa-text-box.spec.ts`

1. Open `https://demoqa.com/text-box`.
2. Validate that the page has a visible heading `Text Box`.
3. Validate that the Full Name, Email, Current Address, and Permanent Address fields are visible and editable.
4. Validate that the Submit button is visible and enabled.

Expected result: the page loads successfully with the expected heading, editable text fields, and usable Submit button.

### 2. Submit Valid Contact Details

**Plan ID:** `DEMOQA-TEXT-BOX-002`
**Automation:** Automated in `tests/demoqa-text-box-submit-valid-details.spec.ts`

1. Open `https://demoqa.com/text-box`.
2. Enter a full name, valid email, current address, and permanent address.
3. Click Submit.
4. Validate that the output panel is visible.
5. Validate that the output panel shows the submitted name, email, current address, and permanent address.

Expected result: all submitted values are rendered in the output panel with the correct labels.

### 3. Submit Multiline Addresses

**Plan ID:** `DEMOQA-TEXT-BOX-003`
**Automation:** Automated in `tests/demoqa-text-box-multiline-addresses.spec.ts`

1. Open `https://demoqa.com/text-box`.
2. Enter a full name and valid email.
3. Enter a multiline current address.
4. Enter a different multiline permanent address.
5. Click Submit.
6. Validate that both addresses are rendered in the output panel and preserve each address line.

Expected result: multiline address content is accepted and displayed without losing address lines.

### 4. Reject Invalid Email Format

**Plan ID:** `DEMOQA-TEXT-BOX-004`
**Automation:** Automated in `tests/demoqa-text-box-invalid-email.spec.ts`

1. Open `https://demoqa.com/text-box`.
2. Enter a full name.
3. Enter an invalid email address without a valid domain.
4. Enter current and permanent addresses.
5. Click Submit.
6. Validate that the email field is marked invalid.
7. Validate that no submission output is visible.

Expected result: invalid email input prevents successful submission and the output panel is not displayed.

### 5. Update Submitted Values on a Later Submission

**Plan ID:** `DEMOQA-TEXT-BOX-005`
**Automation:** Automated in `tests/demoqa-text-box-update-submitted-values.spec.ts`

1. Open `https://demoqa.com/text-box`.
2. Submit one complete set of valid contact details.
3. Replace every field with a second complete set of valid contact details.
4. Click Submit again.
5. Validate that the output panel shows the second set of values.
6. Validate that the first set of values is no longer shown.

Expected result: each submission reflects the current field values and stale values are not retained in the output panel.
