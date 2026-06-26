# Todo App Basic Flow Test Plan

**Seed:** `tests/seed.spec.ts`

## Scope

Validate the core TodoMVC user flow on `https://demo.playwright.dev/todomvc/#/`.

## Assumptions

- Each scenario starts from a fresh browser context and an empty todo list.
- A todo is created by typing text into the "What needs to be done?" input and pressing Enter.
- Blank or whitespace-only todos should be ignored.

## Scenarios

### 1. Add a Todo

1. Open the Todo app.
2. Type a todo title into the new todo input.
3. Press Enter.

Expected result: the todo appears in the list and the active item counter shows one item left.

### 2. Mark a Todo as Completed

1. Open the Todo app.
2. Add a todo.
3. Mark the todo as completed.

Expected result: the todo checkbox is checked, the item is marked completed, and the active item counter shows zero items left.

### 3. Delete a Todo

1. Open the Todo app.
2. Add a todo.
3. Delete the todo.

Expected result: the todo is removed from the list and the main todo section is hidden because no todos remain.

### 4. Reject an Empty Todo

1. Open the Todo app.
2. Submit an empty todo value.
3. Submit a whitespace-only todo value.

Expected result: no todo is added and the main todo section remains hidden.
