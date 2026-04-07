import { describe, expect, it } from "vitest";
import {
  appRegistry,
  getRuntimeApp,
  listRuntimeAppsByPlacement,
} from "./appRegistry";

describe("appRegistry", () => {
  it("marks the implemented app set explicitly", () => {
    // Arrange
    const implementedApps = appRegistry.filter(
      (app) => app.availability === "implemented",
    );

    // Act
    const result = implementedApps.map((app) => app.id);

    // Assert
    expect(result).toEqual(["calculator", "settings"]);
  });

  it("uses explicit dock placement for the curated dock apps", () => {
    // Arrange
    const dockApps = listRuntimeAppsByPlacement("dock");

    // Act
    const result = dockApps.map((app) => app.id);

    // Assert
    expect(result).toEqual(["phone", "browser", "messages", "music"]);
  });

  it("returns null for unknown app ids", () => {
    // Arrange
    const missingAppId = "unknown-app";

    // Act
    const result = getRuntimeApp(missingAppId);

    // Assert
    expect(result).toBeNull();
  });

  it("returns runtime metadata for a known app id", () => {
    // Arrange
    const appId = "calculator";

    // Act
    const result = getRuntimeApp(appId);

    // Assert
    expect(result?.availability).toBe("implemented");
    expect(result?.launchSurface).toBe("calculator");
    expect(result?.placement).toBe("grid");
  });
});
