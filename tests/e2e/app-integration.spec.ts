import { expect, test } from "@playwright/test";
import {
  expectActiveHomePage,
  goToHomePage,
  gotoInstalledContextMode,
  openApp,
  returnHome,
} from "./fixtures/launcher";

test.describe("app integration", () => {
  test("launches milestone apps from the correct page and returns home to that page", async ({
    page,
  }) => {
    await gotoInstalledContextMode(page);

    await openApp(page, "notes");
    await expect(page.getByTestId("notes-local-warning")).toBeVisible();
    await returnHome(page, "notes");
    await expectActiveHomePage(page, 0);

    await goToHomePage(page, 1);

    await openApp(page, "settings");
    await expect(page.getByTestId("settings-managed-apps")).toBeVisible();
    await expect(
      page.getByTestId("settings-managed-app:browser-grid"),
    ).toBeVisible();
    await expect(
      page.getByTestId("settings-managed-app:browser"),
    ).toHaveCount(0);
    await returnHome(page, "settings");
    await expectActiveHomePage(page, 1);

    await openApp(page, "browser-grid");
    await page.getByTestId("browser-destination:mdn-web-docs").click();
    await expect(page.getByTestId("browser-fallback")).toBeVisible();
    await returnHome(page, "browser-grid");
    await expectActiveHomePage(page, 1);
  });

  test("keeps milestone-specific Notes and Browser behaviors intact in the integrated shell", async ({
    page,
  }) => {
    await gotoInstalledContextMode(page);

    await openApp(page, "notes");
    await expect(page.getByTestId("notes-local-warning")).toBeVisible();
    await page.getByTestId("notes-create").click();
    await page.getByTestId("notes-title-input").fill("Phase 14");
    await page.getByTestId("notes-body-input").fill("Integration check");
    await returnHome(page, "notes");
    await expectActiveHomePage(page, 0);

    await goToHomePage(page, 1);
    await openApp(page, "browser-grid");

    const embeddedFixture = page.frameLocator(
      '[data-testid="browser-frame-iframe"]',
    );
    await expect(
      embeddedFixture.getByRole("heading", {
        name: "Embedded destination ready",
      }),
    ).toBeVisible();

    await page.getByTestId("browser-destination:mdn-web-docs").click();
    await expect(page.getByTestId("browser-fallback")).toBeVisible();
    await expect(page.getByTestId("browser-open-external")).toHaveAttribute(
      "href",
      "https://developer.mozilla.org/",
    );
  });
});
