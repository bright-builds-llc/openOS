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
    expect(result).toEqual(["notes", "calculator", "settings"]);
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
