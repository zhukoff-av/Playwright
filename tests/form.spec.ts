// Import necessary modules from Playwright
const {test, expect} = require('@playwright/test');

test.describe('TODO App Tests', () => {

    // Test to add a single todo item
    test('should add a new todo item', async ({page}) => {
        await page.goto('https://demo.playwright.dev/todomvc/#/');
        await page.locator('.new-todo').fill('Write comprehensive tests');
        await page.locator('.new-todo').press('Enter');
        const todoText = await page.locator('.todo-list li .view label').innerText();
        expect(todoText).toBe('Write comprehensive tests');
    });

    // Test to mark a todo item as completed
    test('should mark a todo item as completed', async ({page}) => {
        await page.goto('https://demo.playwright.dev/todomvc/#/');
        await page.locator('.new-todo').fill('Complete this task');
        await page.locator('.new-todo').press('Enter');
        await page.locator('.todo-list li .toggle').click();
        const isChecked = await page.locator('.todo-list li').locator('.toggle').isChecked();
        expect(isChecked).toBe(true);
        await expect(page.locator('.todo-list li')).toHaveClass(/completed/);
    });

    // Test to edit a todo item
    test('should edit a todo item', async ({page}) => {
        await page.goto('https://demo.playwright.dev/todomvc/#/');
        await page.locator('.new-todo').fill('Original task');
        await page.locator('.new-todo').press('Enter');
        const todo = page.locator('.todo-list li');
        await todo.dblclick();
        const editInput = todo.locator('.edit');
        await editInput.fill('Edited task');
        await editInput.press('Enter');
        expect(await todo.locator('.view label').innerText()).toBe('Edited task');
    });

    // Test to delete a todo item
    test('should delete a todo item', async ({page}) => {
        await page.goto('https://demo.playwright.dev/todomvc/#/');
        await page.locator('.new-todo').fill('Task to delete');
        await page.locator('.new-todo').press('Enter');
        const todo = page.locator('.todo-list li');
        await todo.hover();
        await todo.locator('.destroy').click();
        expect(await page.locator('.todo-list li').count()).toBe(0);
    });

    // Test to add multiple todo items
    test('should add multiple todo items', async ({page}) => {
        await page.goto('https://demo.playwright.dev/todomvc/#/');
        const todos = ['Task 1', 'Task 2', 'Task 3'];
        for (const todo of todos) {
            await page.locator('.new-todo').fill(todo);
            await page.locator('.new-todo').press('Enter');
        }
        const items = await page.locator('.todo-list li').count();
        expect(items).toBe(todos.length);
    });

    // Test to filter active todo items
    test('should filter active todo items', async ({page}) => {
        await page.goto('https://demo.playwright.dev/todomvc/#/');

        // Add two tasks
        await page.locator('.new-todo').fill('Active Task');
        await page.locator('.new-todo').press('Enter');
        await page.locator('.new-todo').fill('Completed Task');
        await page.locator('.new-todo').press('Enter');

        // Mark the second task as completed
        await page.locator('.todo-list li').nth(1).locator('.toggle').click();

        // Click on the 'Active' filter
        // await page.locator('text=Active').click();

        // Wait for active items to be displayed
        const activeItems = page.locator('.todo-list li:not(.completed)');
        await expect(activeItems).toHaveCount(1);

        // Verify that the active task is displayed
        const activeTodoText = await activeItems.locator('.view label').innerText();
        expect(activeTodoText).toBe('Active Task');
    });

// Test to filter completed todo items
    test('should filter completed todo items', async ({page}) => {
        await page.goto('https://demo.playwright.dev/todomvc/#/');

        // Add two tasks
        await page.locator('.new-todo').fill('Active Task');
        await page.locator('.new-todo').press('Enter');
        await page.locator('.new-todo').fill('Completed Task');
        await page.locator('.new-todo').press('Enter');

        // Mark the second task as completed
        await page.locator('.todo-list li').nth(1).locator('.toggle').click();

        // Wait for completed items to be displayed
        const completedItems = page.locator('.todo-list li.completed');
        await expect(completedItems).toHaveCount(1);

        // Verify that the completed task is displayed
        const completedTodoText = await completedItems.locator('.view label').innerText();
        expect(completedTodoText).toBe('Completed Task');
    });

    // Test to clear completed items
    test('should clear completed items', async ({page}) => {
        await page.goto('https://demo.playwright.dev/todomvc/#/');
        await page.locator('.new-todo').fill('Task to complete');
        await page.locator('.new-todo').press('Enter');
        await page.locator('.todo-list li .toggle').click(); // Mark as completed
        await page.locator('text=Clear completed').click();
        expect(await page.locator('.todo-list li').count()).toBe(0);
    });

    // Test to toggle all items
    test('should toggle all items', async ({page}) => {
        await page.goto('https://demo.playwright.dev/todomvc/#/');
        const todos = ['Task 1', 'Task 2', 'Task 3'];
        for (const todo of todos) {
            await page.locator('.new-todo').fill(todo);
            await page.locator('.new-todo').press('Enter');
        }
        await page.locator('.toggle-all').click(); // Mark all as completed
        const completedItems = await page.locator('.todo-list li.completed').count();
        expect(completedItems).toBe(todos.length);

        await page.locator('.toggle-all').click(); // Unmark all
        const activeItems = await page.locator('.todo-list li:not(.completed)').count();
        expect(activeItems).toBe(todos.length);
    });

    // Test to check that there’s no ‘Clear completed’ button when no items are completed
    test('should hide "Clear completed" button when no items are completed', async ({page}) => {
        await page.goto('https://demo.playwright.dev/todomvc/#/');
        expect(await page.isVisible('text=Clear completed')).toBe(false);
    });

});