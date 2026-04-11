import { expect, test } from "@playwright/test";
import {
  goToHomePage,
  gotoInstalledContextMode,
  openApp,
} from "./fixtures/launcher";

test.describe("app catalog", () => {
  test("opens through the launcher and browses reviewed submissions from shared metadata", async ({
    page,
  }) => {
    await gotoInstalledContextMode(page);
    await goToHomePage(page, 1);
    await openApp(page, "library");

    await expect(page.getByTestId("app-catalog-app")).toBeVisible();
    await expect(
      page.getByTestId("app-catalog-install-note"),
    ).toContainText("install later");
    await expect(
      page.getByTestId("app-catalog-entry:signal-box"),
    ).toBeVisible();
    await expect(
      page.getByTestId("app-catalog-entry:studio-lab"),
    ).toBeVisible();

    await page
      .getByTestId("app-catalog-category:communication")
      .click();

    await expect(page.getByTestId("app-catalog-list")).toContainText(
      "Signal Box",
    );
    await expect(page.getByTestId("app-catalog-list")).not.toContainText(
      "Studio Lab",
    );
    await expect(page.getByTestId("app-catalog-detail")).toContainText(
      "Bright Builds Labs",
    );
    await expect(
      page.getByTestId("app-catalog-open-repo"),
    ).toHaveAttribute(
      "href",
      "https://github.com/bright-builds-llc/openos-signal-box",
    );

    await page
      .getByTestId("app-catalog-category:creativity")
      .click();

    await expect(page.getByTestId("app-catalog-list")).toContainText(
      "Studio Lab",
    );
    await expect(page.getByTestId("app-catalog-detail")).toContainText(
      "audio sketchpad",
    );
  });
});
