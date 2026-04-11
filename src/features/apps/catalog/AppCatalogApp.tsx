import { startTransition, useEffect, useState, type CSSProperties } from "react";
import { getCanonicalRuntimeAppForLaunchSurface } from "../../runtime/appRegistry";
import {
  listCatalogReadySubmittedApps,
  type SubmittedAppManifest,
} from "../../platform/submittedAppManifests";
import {
  APP_CATALOG_ALL_CATEGORY,
  createCatalogCategoryTestId,
  filterCatalogEntriesByCategory,
  listCatalogCategories,
} from "./appCatalogModel";
import "./appCatalog.css";

function getCatalogRuntimeApp() {
  const maybeCatalogApp =
    getCanonicalRuntimeAppForLaunchSurface("catalog");

  if (maybeCatalogApp === null) {
    throw new Error("Catalog runtime metadata is missing.");
  }

  return maybeCatalogApp;
}

type CatalogCategoryButtonProps = {
  category: string;
  isActive: boolean;
  onSelect: () => void;
};

function CatalogCategoryButton({
  category,
  isActive,
  onSelect,
}: CatalogCategoryButtonProps) {
  return (
    <button
      className="app-catalog__category-chip"
      data-active={isActive ? "true" : "false"}
      data-testid={`app-catalog-category:${createCatalogCategoryTestId(category)}`}
      onClick={onSelect}
      type="button"
    >
      {category}
    </button>
  );
}

type CatalogEntryButtonProps = {
  entry: SubmittedAppManifest;
  isActive: boolean;
  onSelect: () => void;
};

function CatalogEntryButton({
  entry,
  isActive,
  onSelect,
}: CatalogEntryButtonProps) {
  return (
    <button
      className="app-catalog__entry"
      data-active={isActive ? "true" : "false"}
      data-testid={`app-catalog-entry:${entry.id}`}
      onClick={onSelect}
      type="button"
    >
      <div
        className="app-catalog__entry-icon"
                  style={
                    {
                      "--catalog-icon-start": entry.icon.tintStart,
                      "--catalog-icon-end": entry.icon.tintEnd,
                    } as CSSProperties
                  }
      >
        {entry.icon.glyph}
      </div>
      <div className="app-catalog__entry-copy">
        <div className="app-catalog__entry-heading">
          <span className="app-catalog__entry-title">
            {entry.label}
          </span>
          <span className="app-catalog__entry-category">
            {entry.catalog.category}
          </span>
        </div>
        <p className="app-catalog__entry-summary">
          {entry.summary}
        </p>
      </div>
    </button>
  );
}

const CATALOG_RUNTIME_APP = getCatalogRuntimeApp();
const catalogEntries = listCatalogReadySubmittedApps();
const initialCategory = APP_CATALOG_ALL_CATEGORY;

export function AppCatalogApp() {
  const [selectedCategory, setSelectedCategory] =
    useState(initialCategory);
  const [selectedEntryId, setSelectedEntryId] = useState<
    string | null
  >(catalogEntries[0]?.id ?? null);
  const categories = listCatalogCategories(catalogEntries);
  const visibleEntries = filterCatalogEntriesByCategory(
    catalogEntries,
    selectedCategory,
  );
  const selectedEntry =
    visibleEntries.find(
      (entry) => entry.id === selectedEntryId,
    ) ?? null;

  useEffect(() => {
    if (visibleEntries.length === 0) {
      setSelectedEntryId(null);
      return;
    }

    if (
      visibleEntries.some(
        (entry) => entry.id === selectedEntryId,
      )
    ) {
      return;
    }

    setSelectedEntryId(visibleEntries[0]?.id ?? null);
  }, [selectedEntryId, visibleEntries]);

  return (
    <section
      aria-label="App catalog"
      className="app-catalog"
      data-testid="app-catalog-app"
    >
      <header className="app-catalog__hero">
        <div className="app-catalog__hero-copy">
          <p className="app-catalog__eyebrow">openOS</p>
          <h1 className="app-catalog__title">
            {CATALOG_RUNTIME_APP.label}
          </h1>
          <p className="app-catalog__body">
            Browse the first reviewed app submissions powered by the
            repo metadata contract. This surface is for discovery and
            inspection only. Installation remains a later milestone.
          </p>
        </div>
        <div className="app-catalog__hero-status">
          <span className="app-catalog__hero-badge">
            Catalog preview
          </span>
          <span className="app-catalog__hero-metric">
            {catalogEntries.length} reviewed app
            {catalogEntries.length === 1 ? "" : "s"}
          </span>
        </div>
      </header>

      <section
        className="app-catalog__status"
        data-testid="app-catalog-install-note"
      >
        Browse now, install later. openOS is only exposing reviewed
        metadata and app details in this phase.
      </section>

      <nav
        aria-label="Catalog categories"
        className="app-catalog__categories"
        data-testid="app-catalog-categories"
      >
        {categories.map((category) => (
          <CatalogCategoryButton
            category={category}
            isActive={selectedCategory === category}
            key={category}
            onSelect={() => {
              startTransition(() => {
                setSelectedCategory(category);
              });
            }}
          />
        ))}
      </nav>

      <div className="app-catalog__layout">
        <section
          className="app-catalog__list"
          data-testid="app-catalog-list"
        >
          <div className="app-catalog__panel-header">
            <div>
              <p className="app-catalog__eyebrow">
                Browse
              </p>
              <h2 className="app-catalog__panel-title">
                {selectedCategory}
              </h2>
            </div>
            <span className="app-catalog__panel-meta">
              {visibleEntries.length} app
              {visibleEntries.length === 1 ? "" : "s"}
            </span>
          </div>
          {visibleEntries.map((entry) => (
            <CatalogEntryButton
              entry={entry}
              isActive={entry.id === selectedEntryId}
              key={entry.id}
              onSelect={() => {
                setSelectedEntryId(entry.id);
              }}
            />
          ))}
        </section>

        <section
          className="app-catalog__detail"
          data-testid="app-catalog-detail"
        >
          {selectedEntry === null ? null : (
            <>
              <div className="app-catalog__detail-topline">
                <div
                  className="app-catalog__detail-icon"
                  style={
                    {
                      "--catalog-icon-start": selectedEntry.icon.tintStart,
                      "--catalog-icon-end": selectedEntry.icon.tintEnd,
                    } as CSSProperties
                  }
                >
                  {selectedEntry.icon.glyph}
                </div>
                <div>
                  <p className="app-catalog__detail-category">
                    {selectedEntry.catalog.category}
                  </p>
                  <h2 className="app-catalog__detail-title">
                    {selectedEntry.label}
                  </h2>
                  <p className="app-catalog__detail-summary">
                    {selectedEntry.summary}
                  </p>
                </div>
              </div>

              <p className="app-catalog__detail-description">
                {selectedEntry.description}
              </p>

              <div className="app-catalog__detail-grid">
                <div className="app-catalog__detail-block">
                  <span className="app-catalog__detail-label">
                    Developer
                  </span>
                  <span className="app-catalog__detail-value">
                    {selectedEntry.developer.name}
                  </span>
                </div>
                <div className="app-catalog__detail-block">
                  <span className="app-catalog__detail-label">
                    Reviewed
                  </span>
                  <span className="app-catalog__detail-value">
                    {selectedEntry.review.reviewedAt ?? "Pending"}
                  </span>
                </div>
              </div>

              <div className="app-catalog__tag-strip">
                {selectedEntry.catalog.tags.map((tag) => (
                  <span
                    className="app-catalog__tag"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="app-catalog__detail-actions">
                <a
                  className="app-catalog__repo-link"
                  data-testid="app-catalog-open-repo"
                  href={selectedEntry.source.repositoryUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Review repository
                </a>
                <p className="app-catalog__detail-note">
                  This catalog is browse-only for now. Installation and
                  activation arrive in a later phase.
                </p>
              </div>
            </>
          )}
        </section>
      </div>
    </section>
  );
}
