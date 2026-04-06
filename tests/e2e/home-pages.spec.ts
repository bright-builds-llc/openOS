import { test } from "@playwright/test";
import {
  expectActiveHomePage,
  goToHomePage,
  gotoInstalledContextMode,
  openApp,
  returnHome,
} from "./fixtures/launcher";

test.describe("home screen pages", () => {
  test("navigates between home-screen pages", async ({ page }) => {
    await gotoInstalledContextMode(page);

    await expectActiveHomePage(page, 0);

    await goToHomePage(page, 1);
    await expectActiveHomePage(page, 1);
  });

  test("returns home to the page an app launched from", async ({ page }) => {
    await gotoInstalledContextMode(page);

    await goToHomePage(page, 1);
    await openApp(page, "settings");
    await returnHome(page, "settings");

    await expectActiveHomePage(page, 1);
  });
});
