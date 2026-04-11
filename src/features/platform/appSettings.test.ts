import { describe, expect, it } from "vitest";
import {
  createAppSettingsParticipation,
  listSettingsVisibleApps,
  participatesInSettings,
} from "./appSettings";
import { builtInAppDefinitions } from "./appDefinitions";

describe("appSettings", () => {
  it("creates hidden settings participation by default", () => {
    // Arrange

    // Act
    const result = createAppSettingsParticipation();

    // Assert
    expect(result).toEqual({
      visibility: "hidden",
    });
  });

  it("lists only apps that opt into settings visibility", () => {
    // Arrange

    // Act
    const result = listSettingsVisibleApps(builtInAppDefinitions).map(
      (app) => app.id,
    );

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

  it("reports whether a single app participates in settings", () => {
    // Arrange
    const maybeNotes = builtInAppDefinitions.find(
      (app) => app.id === "notes",
    );

    // Act
    const result = maybeNotes
      ? participatesInSettings(maybeNotes)
      : null;

    // Assert
    expect(result).toBe(true);
  });
});
