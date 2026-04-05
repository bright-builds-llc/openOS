import { expect, test } from "@playwright/test";
import {
  gotoBrowserMode,
  gotoInstalledContextMode,
  openApp,
  returnHome,
} from "./fixtures/launcher";

test.describe("shell flow", () => {
  test("keeps browser mode in the install-first preview path", async ({
    page,
  }) => {
    await gotoBrowserMode(page);

    await page.getByRole("button", { name: "Preview in browser" }).click();

    await expect(page.getByTestId("install-overlay")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Show steps" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Calculator" }).click();

    await expect(
      page.getByRole("heading", {
        name: "Install openOS to open Calculator.",
      }),
    ).toBeVisible();
    await expect(page.getByTestId("calculator-app")).toHaveCount(0);
  });

  test("launches Calculator and returns home in installed-context mode", async ({
    page,
  }) => {
    await gotoInstalledContextMode(page);

    await openApp(page, "calculator");

    await expect(page.getByTestId("calculator-app")).toBeVisible();
    await expect(page.getByTestId("home-pill")).toBeVisible();

    await returnHome(page, "calculator");
  });

  test("opens coming-soon apps through the same runtime path", async ({
    page,
  }) => {
    await gotoInstalledContextMode(page);

    await openApp(page, "calendar");

    await expect(page.getByTestId("app-surface:calendar")).toBeVisible();
    await expect(page.getByText("Coming Soon")).toBeVisible();
    await expect(
      page.getByText(
        "Calendar is staged in the launcher now and will get its full behavior in a later phase.",
      ),
    ).toBeVisible();
  });
});
