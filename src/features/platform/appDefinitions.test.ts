import { describe, expect, it } from "vitest";
import {
  builtInAppDefinitions,
  defineRuntimeApp,
} from "./appDefinitions";
import { createAppSettingsParticipation } from "./appSettings";
import { createAppStorageMetadata } from "./appStorage";

describe("appDefinitions", () => {
  it("defines grid apps with explicit page placement", () => {
    // Arrange
    const gridApps = builtInAppDefinitions.filter(
      (app) => app.placement === "grid",
    );

    // Act
    const maybeMissingPage = gridApps.find((app) => app.page < 0);

    // Assert
    expect(maybeMissingPage).toBeUndefined();
  });

  it("keeps dock apps free of page placement", () => {
    // Arrange
    const dockApps = builtInAppDefinitions.filter(
      (app) => app.placement === "dock",
    );

    // Act
    const maybePagedDockApp = dockApps.find(
      (app) => "page" in app,
    );

    // Assert
    expect(maybePagedDockApp).toBeUndefined();
  });

  it("preserves the implemented built-in app set", () => {
    // Arrange
    const implementedApps = builtInAppDefinitions.filter(
      (app) => app.availability === "implemented",
    );

    // Act
    const result = implementedApps.map((app) => app.id);

    // Assert
    expect(result).toEqual([
      "notes",
      "calculator",
      "settings",
      "browser-grid",
      "library",
      "browser",
    ]);
  });

  it("assigns settings participation to the milestone apps", () => {
    // Arrange
    const milestoneApps = builtInAppDefinitions.filter((app) =>
      ["settings", "notes", "browser-grid", "browser", "library"].includes(app.id),
    );

    // Act
    const result = milestoneApps.map((app) => ({
      id: app.id,
      visibility: app.settings.visibility,
    }));

    // Assert
    expect(result).toEqual([
      { id: "notes", visibility: "app-list" },
      { id: "settings", visibility: "app-list" },
      { id: "browser-grid", visibility: "app-list" },
      { id: "library", visibility: "app-list" },
      { id: "browser", visibility: "app-list" },
    ]);
  });

  it("assigns stable storage namespaces to the milestone apps", () => {
    // Arrange
    const milestoneApps = builtInAppDefinitions.filter((app) =>
      ["settings", "notes", "browser-grid", "browser", "library"].includes(app.id),
    );

    // Act
    const result = milestoneApps.map((app) => ({
      id: app.id,
      namespace: app.storage.namespace,
    }));

    // Assert
    expect(result).toEqual([
      { id: "notes", namespace: "openos.apps.notes" },
      { id: "settings", namespace: "openos.apps.settings" },
      { id: "browser-grid", namespace: "openos.apps.browser-grid" },
      { id: "library", namespace: "openos.apps.library" },
      { id: "browser", namespace: "openos.apps.browser" },
    ]);
  });

  it("uses one Browser launch surface across grid and dock entries", () => {
    // Arrange
    const browserEntries = builtInAppDefinitions.filter((app) =>
      ["browser-grid", "browser"].includes(app.id),
    );

    // Act
    const result = browserEntries.map((app) => ({
      id: app.id,
      launchSurface: app.launchSurface,
      placement: app.placement,
    }));

    // Assert
    expect(result).toEqual([
      {
        id: "browser-grid",
        launchSurface: "browser",
        placement: "grid",
      },
      {
        id: "browser",
        launchSurface: "browser",
        placement: "dock",
      },
    ]);
  });

  it("returns a typed definition through the helper", () => {
    // Arrange
    const definition = defineRuntimeApp({
      id: "test",
      label: "Test",
      icon: { glyph: "T", tintStart: "#111111", tintEnd: "#222222" },
      settings: createAppSettingsParticipation("app-list"),
      storage: createAppStorageMetadata("test"),
      placement: "grid",
      page: 2,
      availability: "coming-soon",
      launchSurface: "coming-soon",
    });

    // Act
    const result = definition;

    // Assert
    expect(result).toEqual({
      id: "test",
      label: "Test",
      icon: { glyph: "T", tintStart: "#111111", tintEnd: "#222222" },
      settings: createAppSettingsParticipation("app-list"),
      storage: createAppStorageMetadata("test"),
      placement: "grid",
      page: 2,
      availability: "coming-soon",
      launchSurface: "coming-soon",
    });
  });
});
