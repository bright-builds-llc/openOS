import { expect, test } from "@playwright/test";
import { dismissInstallTakeover, gotoBrowserMode } from "./fixtures/launcher";

test.describe("browser entry", () => {
  test("renders preview content from the shared preview selector", async ({
    page,
  }) => {
    await gotoBrowserMode(page);
    await dismissInstallTakeover(page);

    await expect(page.getByTestId("install-prompt-pill")).toBeVisible();
    await expect(page.getByTestId("preview-app:calculator")).toContainText(
      "Calculator",
    );
    await expect(page.getByTestId("preview-app:weather")).toContainText(
      "Weather",
    );
    await expect(page.getByTestId("preview-app:music-grid")).toContainText(
      "Music",
    );
    await expect(page.getByTestId("preview-dock:phone")).toBeVisible();
    await expect(page.getByTestId("preview-dock:browser")).toBeVisible();
    await expect(page.getByTestId("preview-dock:messages")).toBeVisible();
    await expect(page.getByTestId("preview-dock:music")).toBeVisible();
  });

  test("makes install guidance more actionable from overlay and intercept CTAs", async ({
    page,
  }) => {
    await gotoBrowserMode(page);

    await page.getByTestId("install-overlay-primary").click();

    await expect(page.getByTestId("install-overlay")).toHaveAttribute(
      "data-install-assist-active",
      "true",
    );
    await expect(page.getByTestId("install-overlay-steps")).toBeFocused();

    await dismissInstallTakeover(page);
    await page.getByTestId("preview-app:calculator").click();
    await expect(page.getByTestId("install-intercept-primary")).toBeVisible();

    await page.getByTestId("install-intercept-primary").click();

    await expect(page.getByTestId("install-overlay")).toBeVisible();
    await expect(page.getByTestId("install-overlay")).toHaveAttribute(
      "data-install-assist-active",
      "true",
    );
    await expect(page.getByTestId("install-overlay-steps")).toBeFocused();
  });
});
