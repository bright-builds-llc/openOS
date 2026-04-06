import { expect, type Page } from "@playwright/test";

const STANDALONE_MEDIA_QUERY = "(display-mode: standalone)";

async function enableInstalledContextSignals(page: Page) {
  await page.addInitScript((query) => {
    const originalMatchMedia = window.matchMedia.bind(window);

    window.matchMedia = (value: string) => {
      if (value === query) {
        return {
          matches: true,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
        } as MediaQueryList;
      }

      return originalMatchMedia(value);
    };

    Object.defineProperty(window.navigator, "standalone", {
      configurable: true,
      get: () => true,
    });
  }, STANDALONE_MEDIA_QUERY);
}

export async function gotoBrowserMode(page: Page) {
  await page.goto("/");
  await expect(page.locator("main.app-shell")).toHaveAttribute(
    "data-install-context",
    "browser",
  );
  await expect(page.getByTestId("install-overlay")).toBeVisible();
}

export async function dismissInstallTakeover(page: Page) {
  await page.getByRole("button", { name: "Preview in browser" }).click();
  await expect(page.getByTestId("install-overlay")).toHaveCount(0);
}

export async function gotoInstalledContextMode(page: Page) {
  await enableInstalledContextSignals(page);
  await page.goto("/");
  await expect(page.locator("main.app-shell")).toHaveAttribute(
    "data-install-context",
    "standalone",
  );
  await expect(page.locator("main.app-shell")).toHaveAttribute(
    "data-install-source",
    "display-mode",
  );
  await waitForHomeScreen(page);
}

export async function gotoStandaloneMode(page: Page) {
  await gotoInstalledContextMode(page);
}

export async function openApp(page: Page, appId: string) {
  await page.getByTestId(`app-icon:${appId}`).click();
  await expect(page.getByTestId(`app-surface:${appId}`)).toBeVisible();
}

export async function returnHome(page: Page, appId: string) {
  await page.getByTestId("home-pill").click();
  await expect(page.getByTestId(`app-surface:${appId}`)).toBeHidden();
  await waitForHomeScreen(page);
}

export async function waitForHomeScreen(page: Page) {
  await expect(page.getByLabel("openOS shell foundation")).toBeVisible();
  await expect(page.getByTestId("app-icon:calculator")).toBeVisible();
}

export async function expectActiveHomePage(
  page: Page,
  pageIndex: number,
) {
  await expect(page.getByTestId("home-screen-pages")).toHaveAttribute(
    "data-active-page",
    String(pageIndex),
  );
  await expect(
    page.getByTestId(`home-page-indicator:${pageIndex}`),
  ).toHaveAttribute("aria-selected", "true");
}

export async function goToHomePage(page: Page, pageIndex: number) {
  await page.getByTestId(`home-page-indicator:${pageIndex}`).click();
  await expectActiveHomePage(page, pageIndex);
}
