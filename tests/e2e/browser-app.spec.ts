import { expect, test } from "@playwright/test";
import {
  goToHomePage,
  gotoInstalledContextMode,
  openApp,
} from "./fixtures/launcher";

test.describe("browser app", () => {
  test("opens through the launcher, handles direct urls, and switches cleanly between embedded and fallback destinations", async ({
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
      .getByTestId("browser-address-input")
      .fill("/browser-fixtures/direct-url.html");
    await page.getByTestId("browser-address-go").click();

    await expect(
      page.getByTestId("browser-address-input"),
    ).toHaveValue("/browser-fixtures/direct-url.html");
    await expect(
      page.getByTestId("browser-recents"),
    ).toContainText("Direct Url");
    await expect(
      page.getByTestId("browser-frame-address"),
    ).toContainText("/browser-fixtures/direct-url.html");
    await expect(
      page
        .frameLocator('[data-testid="browser-frame-iframe"]')
        .getByRole("heading", { name: "Direct navigation ready" }),
    ).toBeVisible();

    await page
      .getByTestId("browser-address-input")
      .fill("developer.mozilla.org");
    await page.getByTestId("browser-address-go").click();

    await expect(
      page.getByTestId("browser-address-input"),
    ).toHaveValue("https://developer.mozilla.org/");
    await expect(
      page.getByTestId("browser-open-external"),
    ).toHaveAttribute("href", "https://developer.mozilla.org/");
    await expect(
      page.getByTestId("browser-current-address"),
    ).toContainText("https://developer.mozilla.org/");

    await page
      .getByTestId("browser-destination:openos-guide")
      .click();

    await expect(
      page.getByTestId("browser-destination:openos-guide"),
    ).toHaveAttribute("data-active", "true");
    await expect(
      page.getByTestId("browser-fallback"),
    ).toHaveCount(0);
    await expect(
      embeddedFixture.getByRole("heading", {
        name: "Embedded destination ready",
      }),
    ).toBeVisible();
  });
});
