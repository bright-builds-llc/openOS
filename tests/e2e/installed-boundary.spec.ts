import { expect, test } from "@playwright/test";
import {
  gotoBrowserMode,
  gotoInstalledContextMode,
} from "./fixtures/launcher";

test.describe("installed boundary", () => {
  test("keeps browser entry in the onboarding shell", async ({ page }) => {
    await gotoBrowserMode(page);

    await expect(page.locator("main.app-shell")).toHaveAttribute(
      "data-install-source",
      "default-browser",
    );
    await expect(page.getByTestId("install-overlay")).toBeVisible();
  });

  test("enters the standalone shell through display-mode semantics", async ({
    page,
  }) => {
    await gotoInstalledContextMode(page);

    await expect(page.locator("main.app-shell")).toHaveAttribute(
      "data-install-context",
      "standalone",
    );
    await expect(page.locator("main.app-shell")).toHaveAttribute(
      "data-install-source",
      "display-mode",
    );
    await expect(page.getByLabel("openOS shell foundation")).toBeVisible();
  });
});
