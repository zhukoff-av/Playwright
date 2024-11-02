import {test} from "@playwright/test";

test('Test Pipeline @githubAction', async ({page}) => {
    await page.goto('https://demo.playwright.dev/todomvc/#/');
})