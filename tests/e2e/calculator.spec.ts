import { expect, test, type Page } from "@playwright/test";
import {
  gotoInstalledContextMode,
  openApp,
  returnHome,
} from "./fixtures/launcher";

async function pressCalculatorKey(page: Page, keyId: string) {
  await page.getByTestId(`calculator-key:${keyId}`).click();
}

test("runs the Calculator happy path through the real launcher", async ({
  page,
}) => {
  await gotoInstalledContextMode(page);
  await openApp(page, "calculator");

  await expect(page.getByTestId("calculator-display")).toHaveText("0");

  await pressCalculatorKey(page, "7");
  await expect(page.getByTestId("calculator-display")).toHaveText("7");
  await expect(page.getByTestId("calculator-key:clear")).toHaveText("C");

  await pressCalculatorKey(page, "add");
  await pressCalculatorKey(page, "8");
  await expect(page.getByTestId("calculator-display")).toHaveText("8");

  await pressCalculatorKey(page, "equals");
  await expect(page.getByTestId("calculator-display")).toHaveText("15");

  await returnHome(page, "calculator");
});
