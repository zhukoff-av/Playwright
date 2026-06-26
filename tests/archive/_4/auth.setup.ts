import { test as setup, Page } from "@playwright/test";
import { mkdirSync } from "fs";
import { dirname } from "node:path";

const constFile = "playwright/.auth/auth-setup.json";

setup("auth", async ({ page }) => {
  await page.goto("/login");

  // step 1
  // step 2

  // click on LOGIN btn

  mkdirSync(dirname(constFile), { recursive: true });
  await page.context().storageState({ path: constFile });
});
