# Alloy Software Self Service Portal Test Plan

## Scope

Draft coverage for the Alloy Software demo Self Service Portal at `/hd`.

Seed file: `tests/seed.spec.ts`

Default credentials:

- User name: `Demo`
- Password: `Aa123456`

Observed portal areas:

- Home dashboard with solution search, Submit a Ticket, Request a Service, Latest Updates, My Tickets, Approvals, Announcements, Popular Articles, and AI assistant.
- Ticket creation flow for "Report a Technical Issue" with required fields: Summary, Description, Urgency, Impact, and Category.
- Service Catalog with categories: Access, Equipment, General, Personnel, Software, Training.
- Tickets and Requests list showing ticket `T000008` with status `Closed`.
- Knowledge Base with article filters and articles such as `KB000001`, `KB000002`, `KB000003`, `KB000005`, `KB000006`, `KB000007`.

## 1. Authentication

### 1.1 Sign in with valid demo user

**Plan ID:** `ALLOY-PORTAL-AUTH-001`
**Automation:** Automated in `tests/archive/_5/sign-in-with-valid-demo-user.spec.ts`

**Starting state:** Fresh browser context with no saved portal session.

**Steps:**

1. Open `/hd`.
2. Fill `User Name` with `Demo`.
3. Fill `Password` with `Aa123456`.
4. Click `Sign in`.
5. Wait for the portal home page to load.

**Expected outcome:**

- User lands on `/hd/`.
- Page title or visible content identifies `Self Service Portal`.
- `Find a Solution` heading is visible.
- Search field with placeholder `Search for solutions, services, and tickets` is visible.
- Primary portal actions `Submit a Ticket` and `Request a Service` are available.

### 1.2 Reject invalid credentials

**Plan ID:** `ALLOY-PORTAL-AUTH-002`
**Automation:** Automated in `tests/archive/_5/reject-invalid-credentials.spec.ts`

**Starting state:** Fresh browser context with no saved portal session.

**Steps:**

1. Open `/hd`.
2. Fill `User Name` with an invalid value.
3. Fill `Password` with an invalid value.
4. Click `Sign in`.

**Expected outcome:**

- User remains on the sign-in page.
- A sign-in failure message is shown.
- Portal dashboard content is not visible.

## 2. Home Dashboard

### 2.1 Show key dashboard modules after sign-in

**Plan ID:** `ALLOY-PORTAL-HOME-001`
**Automation:** Automated in `tests/archive/_5/show-key-dashboard-modules-after-sign-in.spec.ts`

**Starting state:** User is signed in and on `/hd/`.

**Steps:**

1. Verify the home header shows `Self Service Portal`.
2. Verify the `Find a Solution` search area is visible.
3. Verify `Latest Updates`, `Popular Service Catalog Items`, `My Tickets`, `Approvals`, `Announcements`, and `Popular Articles` modules are visible.
4. Verify `Submit a Ticket`, `Request a Service`, and `Ask a Question` entry points are visible.

**Expected outcome:**

- All main dashboard modules render without blank panels.
- Empty modules show a readable empty state such as `There are no items to display`.
- Popular Service Catalog Items and Popular Articles contain clickable records.

### 2.2 Search from Find a Solution

**Plan ID:** `ALLOY-PORTAL-HOME-002`
**Automation:** Automated in `tests/archive/_5/search-from-find-a-solution.spec.ts`

**Starting state:** User is signed in and on `/hd/`.

**Steps:**

1. Click the solution search field.
2. Search for `printer`.
3. Submit the search.

**Expected outcome:**

- Search results page or results list appears.
- Results include relevant knowledge base articles or service catalog items, such as printer-related articles or requests.
- User can open a result and return to the search results or portal.

## 3. Ticket Creation

### 3.1 Open Report a Technical Issue form

**Plan ID:** `ALLOY-PORTAL-TICKET-001`
**Automation:** Automated in `tests/archive/_5/open-report-a-technical-issue-form.spec.ts`

**Starting state:** User is signed in and on `/hd/`.

**Steps:**

1. Click `Submit a Ticket`.
2. Wait for the `Report a Technical Issue` form.

**Expected outcome:**

- Form title `Report a Technical Issue` is visible.
- Required fields are visible: `Summary`, `Description`, `Category`, `Urgency`, and `Impact`.
- Navigation buttons `Back` and `Next` are visible.

### 3.2 Validate required fields on ticket form

**Plan ID:** `ALLOY-PORTAL-TICKET-002`
**Automation:** Automated in `tests/archive/_5/validate-required-fields-on-ticket-form.spec.ts`

**Starting state:** User is signed in and the `Report a Technical Issue` form is open.

**Steps:**

1. Leave all required fields blank.
2. Click `Next`.

**Expected outcome:**

- User remains on the form.
- Required-field validation is displayed for missing values.
- No ticket is created.

### 3.3 Create a technical issue ticket

**Plan ID:** `ALLOY-PORTAL-TICKET-003`
**Automation:** Automated in `tests/archive/_5/create-a-technical-issue-ticket.spec.ts`

**Starting state:** User is signed in and the `Report a Technical Issue` form is open.

**Steps:**

1. Fill `Summary` with a unique test summary, for example `PW test - VPN issue <timestamp>`.
2. Fill `Description` with a clear issue description.
3. Select a valid `Category`.
4. Select valid `Urgency` and `Impact` values.
5. Click `Next`.
6. Review the request if a review step appears.
7. Submit the ticket.

**Expected outcome:**

- Ticket submission succeeds.
- A confirmation or created ticket page is shown.
- Created ticket has the submitted summary and an initial status.
- The ticket can be found from `My Tickets` or `Tickets and Requests`.

## 4. Service Catalog

### 4.1 Browse all service catalog items

**Plan ID:** `ALLOY-PORTAL-SERVICE-001`
**Automation:** Automated in `tests/archive/_5/browse-all-service-catalog-items.spec.ts`

**Starting state:** User is signed in.

**Steps:**

1. Open `Request a Service` from the home page.
2. Verify the `Service Catalog` page opens.
3. Verify categories are visible: `Access`, `Equipment`, `General`, `Personnel`, `Software`, and `Training`.
4. Verify service items are listed with `Submit` actions.

**Expected outcome:**

- Catalog renders a list of requestable services.
- Items include examples such as `Account Creation`, `Hardware Request`, `Remote Access`, and `Software Request`.
- Each visible service item has enough description for the user to understand the request.

### 4.2 Filter service catalog by category

**Plan ID:** `ALLOY-PORTAL-SERVICE-002`
**Automation:** Automated in `tests/archive/_5/filter-service-catalog-by-category.spec.ts`

**Starting state:** User is signed in and on the Service Catalog page.

**Steps:**

1. Select category `Access`.
2. Review visible catalog items.
3. Select category `Equipment`.
4. Review visible catalog items.

**Expected outcome:**

- Category selection updates the visible list.
- Access category shows access-related services such as account or remote access requests.
- Equipment category shows equipment-related services such as hardware, phone, printer, toner, or lending requests.

### 4.3 Open a service item details page

**Plan ID:** `ALLOY-PORTAL-SERVICE-003`
**Automation:** Automated in `tests/archive/_5/open-a-service-item-details-page.spec.ts`

**Starting state:** User is signed in and on the Service Catalog page.

**Steps:**

1. Open `Hardware Request`.
2. Verify item details are displayed.
3. Click `Submit`.

**Expected outcome:**

- Details page identifies the selected service.
- User can start the request flow for the selected item.
- Required fields are clearly marked before submission.

## 5. Tickets and Requests

### 5.1 View My Tickets list

**Plan ID:** `ALLOY-PORTAL-TICKETS-001`
**Automation:** Automated in `tests/archive/_5/view-my-tickets-list.spec.ts`

**Starting state:** User is signed in.

**Steps:**

1. Open `My Tickets` or `/hd/ticketsAndRequests/tickets`.
2. Verify the tickets table is visible.
3. Check columns for ticket number, summary, status, and created date.

**Expected outcome:**

- Tickets list loads successfully.
- Existing ticket `T000008` with summary `Several customers unable to access network` and status `Closed` is visible in the demo data.
- Pagination or row count is visible.

### 5.2 Open ticket details from list

**Plan ID:** `ALLOY-PORTAL-TICKETS-002`
**Automation:** Automated in `tests/archive/_5/open-ticket-details-from-list.spec.ts`

**Starting state:** User is signed in and on the tickets list.

**Steps:**

1. Click ticket `T000008`.
2. Wait for ticket details to load.

**Expected outcome:**

- Ticket detail page opens.
- Ticket number, summary, status, and created date are consistent with the list row.
- User can navigate back to the tickets list.

## 6. Knowledge Base and Announcements

### 6.1 Browse Knowledge Base articles

**Plan ID:** `ALLOY-PORTAL-KB-001`
**Automation:** Automated in `tests/archive/_5/browse-knowledge-base-articles.spec.ts`

**Starting state:** User is signed in.

**Steps:**

1. Open `/hd/knowledgeBase`.
2. Verify `Knowledge Base` and `All Articles` are visible.
3. Verify article list includes visible article IDs and titles.
4. Open `KB000003 How to hook up a printer on your laptop`.

**Expected outcome:**

- Knowledge Base list loads.
- Article detail page opens for the selected article.
- Article content is readable and the user can return to the article list.

### 6.2 Filter Knowledge Base by article type

**Plan ID:** `ALLOY-PORTAL-KB-002`
**Automation:** Automated in `tests/archive/_5/filter-knowledge-base-by-article-type.spec.ts`

**Starting state:** User is signed in and on the Knowledge Base page.

**Steps:**

1. Select a visible article type filter, such as `Hardware` or `Software`.
2. Review the article list.

**Expected outcome:**

- Article list updates according to the selected filter.
- Empty results, if any, show a readable empty state.

### 6.3 View announcement details

**Plan ID:** `ALLOY-PORTAL-ANNOUNCEMENT-001`
**Automation:** Automated in `tests/archive/_5/view-announcement-details.spec.ts`

**Starting state:** User is signed in.

**Steps:**

1. Open the home page.
2. Click announcement `Network Shares, Email and Internet Access Temporarily Unavailable`.

**Expected outcome:**

- Announcement detail page opens.
- Title and date are visible.
- Announcement body is readable.

## 7. AI Assistant

### 7.1 Start a basic assistant conversation

**Plan ID:** `ALLOY-PORTAL-ASSISTANT-001`
**Automation:** Automated in `tests/archive/_5/start-a-basic-assistant-conversation.spec.ts`

**Starting state:** User is signed in and the AI assistant widget is visible.

**Steps:**

1. Focus the assistant text area with placeholder `Describe your issue or ask a question...`.
2. Type `How do I reset my password?`.
3. Submit the message.

**Expected outcome:**

- User message appears in the chat.
- Assistant returns a response or relevant portal guidance.
- Chat controls such as new chat, helpful/not helpful, minimize, or expand remain usable.
