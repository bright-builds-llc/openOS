import { describe, expect, it } from "vitest";
import { appRegistry } from "../../runtime/appRegistry";
import {
  getBrowserPreviewDockApps,
  getBrowserPreviewGridApps,
} from "./browserPreviewApps";

describe("browserPreviewApps", () => {
  it("derives the curated preview grid from the runtime registry", () => {
    // Arrange
    const expectedLabels = [
      "Calculator",
      "Weather",
      "Camera",
      "Photos",
      "Music",
      "Notes",
      "Maps",
      "Clock",
    ];

    // Act
    const result = getBrowserPreviewGridApps(appRegistry);

    // Assert
    expect(result.map((app) => app.label)).toEqual(expectedLabels);
    expect(result.every((app) => app.placement === "grid")).toBe(true);
  });

  it("derives the curated preview dock from the runtime registry", () => {
    // Arrange
    const expectedLabels = ["Phone", "Browser", "Messages", "Music"];

    // Act
    const result = getBrowserPreviewDockApps(appRegistry);

    // Assert
    expect(result.map((app) => app.label)).toEqual(expectedLabels);
    expect(result.every((app) => app.placement === "dock")).toBe(true);
  });
});
