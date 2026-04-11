import type { SubmittedAppManifest } from "../../platform/submittedAppManifests";

export const APP_CATALOG_ALL_CATEGORY = "All";

function compareCatalogText(
  left: string,
  right: string,
): number {
  return left.localeCompare(right, undefined, {
    sensitivity: "base",
  });
}

export function listCatalogCategories(
  maybeEntries: SubmittedAppManifest[],
): string[] {
  const categories = [
    ...new Set(
      maybeEntries.map((entry) => entry.catalog.category),
    ),
  ].sort(compareCatalogText);

  return [APP_CATALOG_ALL_CATEGORY, ...categories];
}

export function filterCatalogEntriesByCategory(
  maybeEntries: SubmittedAppManifest[],
  selectedCategory: string,
): SubmittedAppManifest[] {
  if (selectedCategory === APP_CATALOG_ALL_CATEGORY) {
    return [...maybeEntries].sort((left, right) =>
      compareCatalogText(left.label, right.label),
    );
  }

  return maybeEntries
    .filter(
      (entry) => entry.catalog.category === selectedCategory,
    )
    .sort((left, right) =>
      compareCatalogText(left.label, right.label),
    );
}

export function createCatalogCategoryTestId(
  category: string,
): string {
  return (
    category
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "category"
  );
}
