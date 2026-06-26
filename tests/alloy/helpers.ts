import { existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { expect, type Page } from "@playwright/test";

export const alloyUser = process.env.ALLOY_USER ?? "Demo";
export const alloyPassword = process.env.ALLOY_PASSWORD ?? "Aa123456";

const authLockDir = join(process.cwd(), "test-results", ".alloy-auth-lock");

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withAuthLock<T>(callback: () => Promise<T>) {
  mkdirSync(dirname(authLockDir), { recursive: true });

  while (true) {
    try {
      mkdirSync(authLockDir);
      break;
    } catch (error) {
      if (!existsSync(authLockDir)) {
        continue;
      }

      await wait(250);
    }
  }

  try {
    return await callback();
  } finally {
    rmSync(authLockDir, { force: true, recursive: true });
  }
}

export async function disableAssistantOverlay(page: Page) {
  await page.addStyleTag({
    content: `
      .fixed.right-6.bottom-6.z-50 {
        display: none !important;
        pointer-events: none !important;
      }
    `,
  }).catch(() => {});
}

export async function expectPortalSearch(page: Page) {
  await expect(
    page.getByRole("textbox", { name: /search for solutions/i }),
  ).toBeVisible();
}

export async function openPortalRoute(page: Page, route: string) {
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle").catch(() => {});
  await disableAssistantOverlay(page);
}
