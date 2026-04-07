import { expect, test } from "@playwright/test";
import {
  goToHomePage,
  gotoInstalledContextMode,
  openApp,
} from "./fixtures/launcher";

test.describe("browser app", () => {
  test("opens through the launcher, renders embedded content, and falls back gracefully", async ({
    page,
  }) => {
    await gotoInstalledContextMode(page);
    await goToHomePage(page, 1);
    await openApp(page, "browser-grid");

    await expect(page.getByTestId("browser-app")).toBeVisible();
    await expect(
      page.getByTestId("browser-destination:openos-guide"),
    ).toHaveAttribute("data-active", "true");

    const embeddedFixture = page.frameLocator(
      '[data-testid="browser-frame-iframe"]',
    );
    await expect(
      embeddedFixture.getByRole("heading", {
        name: "Embedded destination ready",
      }),
    ).toBeVisible();

    await page
      .getByTestId("browser-destination:mdn-web-docs")
      .click();

    await expect(page.getByTestId("browser-fallback")).toBeVisible();
    await expect(
      page.getByTestId("browser-open-external"),
    ).toHaveAttribute("href", "https://developer.mozilla.org/");
  });
});
