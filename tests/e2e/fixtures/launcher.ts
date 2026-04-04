import type { Page } from "@playwright/test";

export async function gotoBrowserMode(page: Page) {
  await page.goto("/");
}

export async function gotoStandaloneMode(page: Page) {
  await page.goto("/?openos-install-context=standalone");
}

export async function openApp(page: Page, appId: string) {
  await page.getByTestId(`app-icon:${appId}`).click();
}
