import { describe, expect, it } from "vitest";
import {
  listCatalogReadySubmittedApps,
} from "../../platform/submittedAppManifests";
import {
  APP_CATALOG_ALL_CATEGORY,
  createCatalogCategoryTestId,
  filterCatalogEntriesByCategory,
  listCatalogCategories,
} from "./appCatalogModel";

describe("appCatalogModel", () => {
  it("lists the all category first and then unique categories", () => {
    // Arrange
    const entries = listCatalogReadySubmittedApps();

    // Act
    const result = listCatalogCategories(entries);

    // Assert
    expect(result).toEqual([
      APP_CATALOG_ALL_CATEGORY,
      "Communication",
      "Creativity",
    ]);
  });

  it("filters entries by category while leaving all sorted by label", () => {
    // Arrange
    const entries = listCatalogReadySubmittedApps();

    // Act
    const allEntries = filterCatalogEntriesByCategory(
      entries,
      APP_CATALOG_ALL_CATEGORY,
    );
    const communicationEntries =
      filterCatalogEntriesByCategory(
        entries,
        "Communication",
      );

    // Assert
    expect(allEntries.map((entry) => entry.id)).toEqual([
      "signal-box",
      "studio-lab",
    ]);
    expect(
      communicationEntries.map((entry) => entry.id),
    ).toEqual(["signal-box"]);
  });

  it("creates deterministic category test ids", () => {
    // Arrange

    // Act
    const result = createCatalogCategoryTestId(
      "Creative Tools",
    );

    // Assert
    expect(result).toBe("creative-tools");
  });
});
