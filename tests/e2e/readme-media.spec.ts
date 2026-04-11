import { expect, test } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import {
  goToHomePage,
  gotoInstalledContextMode,
  openApp,
  returnHome,
  waitForHomeScreen,
} from "./fixtures/launcher";

test.describe.configure({ mode: "serial" });

type ReadmeMediaPaths = {
  capturesDir: string;
};

function getReadmeMediaPaths(): ReadmeMediaPaths {
  const maybeCapturesDir = process.env.README_MEDIA_OUT_DIR;
  if (typeof maybeCapturesDir !== "string" || maybeCapturesDir.length === 0) {
    throw new Error("README_MEDIA_OUT_DIR is required.");
  }

  return {
    capturesDir: maybeCapturesDir,
  };
}

async function ensureReadmeMediaDirectories(
  paths: ReadmeMediaPaths,
) {
  await fs.mkdir(paths.capturesDir, { recursive: true });
}

function getCapturePath(
  paths: ReadmeMediaPaths,
  filename: string,
) {
  return path.join(paths.capturesDir, filename);
}

async function blurActiveElement(
  page: import("@playwright/test").Page,
) {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });
}

test("captures shipped README media from real launcher flows", async ({
  page,
}) => {
  const paths = getReadmeMediaPaths();
  await ensureReadmeMediaDirectories(paths);
  await page.emulateMedia({ reducedMotion: "reduce" });

  await gotoInstalledContextMode(page);
  await goToHomePage(page, 1);

  await page
    .getByLabel("openOS shell foundation")
    .screenshot({
      animations: "disabled",
      path: getCapturePath(paths, "home-pages.png"),
    });

  await goToHomePage(page, 0);
  await page.screenshot({
    animations: "disabled",
    path: getCapturePath(paths, "launcher-home.png"),
  });

  await openApp(page, "calculator");
  await page.getByTestId("calculator-key:7").click();
  await page.getByTestId("calculator-key:add").click();
  await page.getByTestId("calculator-key:8").click();
  await page.getByTestId("calculator-key:equals").click();
  await expect(
    page.getByTestId("calculator-display"),
  ).toHaveText("15");
  await blurActiveElement(page);
  await page.waitForTimeout(300);
  await page.screenshot({
    animations: "disabled",
    path: getCapturePath(paths, "launcher-calculator.png"),
  });
  await page.getByTestId("app-surface:calculator").screenshot({
    animations: "disabled",
    path: getCapturePath(paths, "calculator.png"),
  });
  await returnHome(page, "calculator");

  await goToHomePage(page, 1);
  await openApp(page, "settings");
  await page.getByTestId("app-surface:settings").screenshot({
    animations: "disabled",
    path: getCapturePath(paths, "settings.png"),
  });
  await returnHome(page, "settings");

  await goToHomePage(page, 0);
  await openApp(page, "notes");
  await page.getByTestId("notes-create").click();
  await page.getByTestId("notes-title-input").fill("v1.2 ideas");
  await page
    .getByTestId("notes-body-input")
    .fill("Search notes, direct URLs, app catalog.");
  await blurActiveElement(page);
  await page.getByTestId("app-surface:notes").screenshot({
    animations: "disabled",
    path: getCapturePath(paths, "notes.png"),
  });
  await returnHome(page, "notes");

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
  await page.getByTestId("app-surface:browser-grid").screenshot({
    animations: "disabled",
    path: getCapturePath(paths, "browser.png"),
  });
});
