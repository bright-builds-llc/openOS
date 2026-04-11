import { expect, test } from "@playwright/test";
import {
  goToHomePage,
  gotoInstalledContextMode,
  openApp,
  returnHome,
} from "./fixtures/launcher";

test.describe("distribution integration", () => {
  test("proves notes, browser, catalog, and submission review flow together through the launcher path", async ({
    page,
  }) => {
    await gotoInstalledContextMode(page);

    await openApp(page, "notes");
    await page.getByTestId("notes-folder-input").fill("Launch");
    await page.getByTestId("notes-folder-save").click();
    await page.getByTestId("notes-create").click();
    await page.getByTestId("notes-title-input").fill("Catalog launch");
    await page
      .getByTestId("notes-body-input")
      .fill("Signal Box and Studio Lab ship through reviewed metadata.");
    await page
      .getByTestId("notes-search-input")
      .fill("reviewed metadata");
    await expect(page.getByTestId("notes-list")).toContainText(
      "Catalog launch",
    );
    await returnHome(page, "notes");

    await goToHomePage(page, 1);

    await openApp(page, "browser-grid");
    await page
      .getByTestId("browser-address-input")
      .fill("/browser-fixtures/direct-url.html");
    await page.getByTestId("browser-address-go").click();
    await expect(
      page
        .frameLocator('[data-testid="browser-frame-iframe"]')
        .getByRole("heading", {
          name: "Direct navigation ready",
        }),
    ).toBeVisible();

    await page
      .getByTestId("browser-address-input")
      .fill("developer.mozilla.org");
    await page.getByTestId("browser-address-go").click();
    await expect(page.getByTestId("browser-fallback")).toBeVisible();
    await expect(
      page.getByTestId("browser-open-external"),
    ).toHaveAttribute("href", "https://developer.mozilla.org/");
    await returnHome(page, "browser-grid");

    await openApp(page, "library");
    await expect(
      page.getByTestId("app-catalog-install-note"),
    ).toContainText("install later");
    await page
      .getByTestId("app-catalog-category:communication")
      .click();
    await page.getByTestId("app-catalog-entry:signal-box").click();
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
    await returnHome(page, "library");

    await openApp(page, "settings");
    await expect(
      page.getByTestId("settings-managed-app:library"),
    ).toContainText("Library");
    await returnHome(page, "settings");
  });
});
