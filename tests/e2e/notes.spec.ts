import { expect, test, type Page } from "@playwright/test";
import {
  gotoInstalledContextMode,
  openApp,
  returnHome,
  waitForHomeScreen,
} from "./fixtures/launcher";

const NOTES_DURABLE_STORAGE_KEY = "openos.apps.notes.notes";
const NOTES_SESSION_STORAGE_KEY = "openos.apps.notes.session";

async function expectGroceriesContext(page: Page) {
  await expect(page.getByTestId("notes-folder-filter:recipes")).toHaveAttribute(
    "data-active",
    "true",
  );
  await expect(page.getByTestId("notes-search-input")).toHaveValue(
    "Pack charger",
  );
  await expect(page.getByTestId("notes-title-input")).toHaveValue(
    "Groceries",
  );
  await expect(page.getByTestId("notes-block-input:2")).toHaveValue(
    "Pack charger",
  );
  await expect(page.getByTestId("notes-block-check:2")).toBeChecked();
}

async function assertGroceriesDurableSnapshot(page: Page) {
  await page.evaluate((storageKey) => {
    const maybeRawSnapshot = localStorage.getItem(storageKey);

    if (maybeRawSnapshot === null) {
      throw new Error("Expected durable Notes snapshot.");
    }

    const snapshot = JSON.parse(maybeRawSnapshot) as {
      version?: unknown;
      notes?: Array<{
        title?: unknown;
        body?: unknown;
        content?: {
          version?: unknown;
          blocks?: Array<{
            kind?: unknown;
            text?: unknown;
            checked?: unknown;
          }>;
        };
      }>;
    };

    if (snapshot.version !== 3) {
      throw new Error("Expected durable Notes snapshot version 3.");
    }

    if (!Array.isArray(snapshot.notes)) {
      throw new Error("Expected durable Notes array.");
    }

    const maybeGroceriesNote = snapshot.notes.find(
      (note) => note.title === "Groceries",
    );

    if (maybeGroceriesNote === undefined) {
      throw new Error("Expected Groceries note in durable snapshot.");
    }

    if (Object.prototype.hasOwnProperty.call(maybeGroceriesNote, "body")) {
      throw new Error("Expected Groceries note to omit legacy body.");
    }

    const maybeBlocks = maybeGroceriesNote.content?.blocks;

    if (
      maybeGroceriesNote.content?.version !== 1 ||
      !Array.isArray(maybeBlocks)
    ) {
      throw new Error("Expected Groceries note structured content.");
    }

    const hasParagraphBlock = maybeBlocks.some(
      (block) =>
        block.kind === "paragraph" &&
        block.text === "Eggs and milk",
    );
    const hasHeadingBlock = maybeBlocks.some(
      (block) => block.kind === "heading" && block.text === "Trip plan",
    );
    const hasCheckedChecklistBlock = maybeBlocks.some(
      (block) =>
        block.kind === "checklistItem" &&
        block.text === "Pack charger" &&
        block.checked === true,
    );

    if (
      !hasParagraphBlock ||
      !hasHeadingBlock ||
      !hasCheckedChecklistBlock
    ) {
      throw new Error(
        "Expected paragraph, heading, and checked checklist blocks.",
      );
    }
  }, NOTES_DURABLE_STORAGE_KEY);
}

async function assertGroceriesSessionSnapshot(page: Page) {
  await expect
    .poll(async () =>
      page.evaluate((storageKey) => {
        const maybeRawSession = localStorage.getItem(storageKey);

        if (maybeRawSession === null) {
          return "missing";
        }

        const snapshot = JSON.parse(maybeRawSession) as {
          version?: unknown;
          session?: {
            selectedFolderId?: unknown;
            selectedNoteId?: unknown;
            searchQuery?: unknown;
            selectedBlockIndex?: unknown;
          };
        };

        const maybeSession = snapshot.session;

        if (
          snapshot.version !== 1 ||
          maybeSession === undefined ||
          typeof maybeSession.selectedFolderId !== "string" ||
          maybeSession.selectedFolderId.length === 0 ||
          typeof maybeSession.selectedNoteId !== "string" ||
          maybeSession.selectedNoteId.length === 0 ||
          maybeSession.searchQuery !== "Pack charger" ||
          maybeSession.selectedBlockIndex !== 2
        ) {
          return "pending";
        }

        return "ready";
      }, NOTES_SESSION_STORAGE_KEY),
    )
    .toBe("ready");
}

test.describe("notes app", () => {
  test("creates structured content, resumes editor state, and isolates malformed sessions", async ({
    page,
  }) => {
    await gotoInstalledContextMode(page);
    await openApp(page, "notes");

    await expect(page.getByTestId("notes-app")).toBeVisible();
    await expect(page.getByTestId("notes-local-warning")).toBeVisible();
    await expect(page.getByTestId("notes-search-input")).toBeVisible();

    await page.getByTestId("notes-folder-input").fill("Recipes");
    await page.getByTestId("notes-folder-save").click();
    await expect(
      page.getByTestId("notes-folder-filter:recipes"),
    ).toBeVisible();
    await page.getByTestId("notes-folder-filter:recipes").click();
    await expect(
      page.getByTestId("notes-folder-filter:recipes"),
    ).toHaveAttribute("data-active", "true");

    await page.getByTestId("notes-create").click();
    await page.getByTestId("notes-title-input").fill("Groceries");
    await page.getByTestId("notes-block-input:0").fill("Eggs and milk");
    await page.getByTestId("notes-add-heading").click();
    await page.getByTestId("notes-block-input:1").fill("Trip plan");
    await page.getByTestId("notes-add-checklist-item").click();
    await page.getByTestId("notes-block-input:2").fill("Pack charger");
    await page.getByTestId("notes-block-check:2").check();

    await page.getByTestId("notes-search-input").fill("Pack charger");
    await expect(page.getByTestId("notes-list")).toContainText(
      "Groceries",
    );
    await expect(page.getByTestId("notes-list")).toContainText(
      "Pack charger",
    );
    await page.getByTestId("notes-block-input:2").focus();

    await assertGroceriesDurableSnapshot(page);
    await assertGroceriesSessionSnapshot(page);

    await returnHome(page, "notes");
    await openApp(page, "notes");
    await expectGroceriesContext(page);

    await page.reload();
    await waitForHomeScreen(page);
    await openApp(page, "notes");
    await expectGroceriesContext(page);

    await returnHome(page, "notes");
    await page.evaluate((storageKey) => {
      localStorage.setItem(storageKey, "{bad-json");
    }, NOTES_SESSION_STORAGE_KEY);
    await page.reload();
    await waitForHomeScreen(page);
    await openApp(page, "notes");

    await expect(page.getByTestId("notes-session-warning")).toBeVisible();
    await page.getByTestId("notes-search-input").fill("Pack charger");
    await expect(page.getByTestId("notes-list")).toContainText(
      "Groceries",
    );
    await expect(page.getByTestId("notes-list")).toContainText(
      "Pack charger",
    );
    await assertGroceriesDurableSnapshot(page);
  });
});
