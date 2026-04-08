import { expect, test } from "@playwright/test";
import {
  gotoInstalledContextMode,
  goToHomePage,
  openApp,
  returnHome,
} from "./fixtures/launcher";

test.describe("settings app", () => {
  test("opens through the launcher, applies a preference, and persists it", async ({
    page,
  }) => {
    await gotoInstalledContextMode(page);
    await goToHomePage(page, 1);
    await openApp(page, "settings");

    await expect(page.getByTestId("settings-app")).toBeVisible();
    await page.getByTestId("settings-theme:midnight").click();
    await expect(page.getByLabel("openOS shell foundation")).toHaveAttribute(
      "data-theme-preset",
      "midnight",
    );

    await returnHome(page, "settings");
    await page.reload();
    await expect(page.getByLabel("openOS shell foundation")).toHaveAttribute(
      "data-theme-preset",
      "midnight",
    );
    await goToHomePage(page, 1);
    await openApp(page, "settings");
    await expect(
      page.getByTestId("settings-theme:midnight"),
    ).toHaveAttribute("data-active", "true");
  });

  test("shows the first internal app-management surface from shared metadata", async ({
    page,
  }) => {
    await gotoInstalledContextMode(page);
    await goToHomePage(page, 1);
    await openApp(page, "settings");

    await expect(page.getByTestId("settings-managed-apps")).toBeVisible();
    await expect(
      page.getByTestId("settings-managed-app:settings"),
    ).toContainText("Settings");
    await expect(
      page.getByTestId("settings-managed-app:notes"),
    ).toContainText("Notes");
    await expect(
      page.getByTestId("settings-managed-app:browser-grid"),
    ).toContainText("Browser");
    await expect(
      page.getByTestId("settings-managed-app:browser"),
    ).toHaveCount(0);

    const browserRows = page.locator(
      '[data-testid="settings-managed-app:browser-grid"]',
    );
    await expect(browserRows).toHaveCount(1);
  });
});
