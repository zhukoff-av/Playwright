import { expect, test, type Locator, type Page } from '@playwright/test';

const TODO_APP_URL = 'https://demo.playwright.dev/todomvc/#/';

test.describe('Todo app basic flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TODO_APP_URL);
  });

  test('user can add a todo', async ({ page }) => {
    // 1. Type a todo title into the new todo input.
    await addTodo(page, 'Write a focused Playwright test');

    // 2. Verify the todo appears and the active counter updates.
    await expect(todoTitles(page)).toHaveText(['Write a focused Playwright test']);
    await expect(page.getByTestId('todo-count')).toHaveText('1 item left');
  });

  test('user can mark a todo as completed', async ({ page }) => {
    // 1. Add a todo.
    await addTodo(page, 'Mark this todo as completed');
    const todo = todoItems(page).filter({ hasText: 'Mark this todo as completed' });

    // 2. Mark the todo as completed.
    await todo.getByRole('checkbox').check();

    // 3. Verify the todo state and active counter.
    await expect(todo.getByRole('checkbox')).toBeChecked();
    await expect(todo).toHaveClass(/completed/);
    await expect(page.getByTestId('todo-count')).toHaveText('0 items left');
  });

  test('user can delete a todo', async ({ page }) => {
    // 1. Add a todo.
    await addTodo(page, 'Delete this todo');
    const todo = todoItems(page).filter({ hasText: 'Delete this todo' });

    // 2. Delete the todo.
    await todo.hover();
    await todo.getByRole('button').click();

    // 3. Verify the todo is removed.
    await expect(todoItems(page)).toHaveCount(0);
  });

  test('empty todo should not be added', async ({ page }) => {
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // 1. Submit an empty todo.
    await newTodo.press('Enter');

    // 2. Submit a whitespace-only todo.
    await newTodo.fill('   ');
    await newTodo.press('Enter');

    // 3. Verify no todo was created.
    await expect(todoItems(page)).toHaveCount(0);
  });
});

async function addTodo(page: Page, title: string) {
  const newTodo = page.getByPlaceholder('What needs to be done?');

  await newTodo.fill(title);
  await newTodo.press('Enter');
}

function todoItems(page: Page): Locator {
  return page.getByTestId('todo-item');
}

function todoTitles(page: Page): Locator {
  return page.getByTestId('todo-title');
}
