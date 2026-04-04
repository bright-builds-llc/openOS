import { describe, expect, it } from "vitest";
import { appRegistry } from "./appRegistry";
import {
  createInitialHomeScreenRuntimeState,
  getOpenRuntimeApp,
  openRuntimeApp,
  PRESSED_ICON_DURATION_MS,
} from "./homeScreenRuntime";

describe("homeScreenRuntime", () => {
  it("starts on the home screen", () => {
    // Arrange
    // No arrange needed.

    // Act
    const result = createInitialHomeScreenRuntimeState();

    // Assert
    expect(result).toEqual({
      kind: "home",
      motionMode: "full",
      driver: "css",
    });
  });

  it("opens a known launchable app", () => {
    // Arrange
    const currentState = createInitialHomeScreenRuntimeState();

    // Act
    const result = openRuntimeApp("calculator", appRegistry, currentState);

    // Assert
    expect(result).toEqual({
      kind: "opening",
      appId: "calculator",
      originRect: null,
      motionMode: "full",
      driver: "css",
    });
  });

  it("does not change state for an unknown app", () => {
    // Arrange
    const currentState = createInitialHomeScreenRuntimeState();

    // Act
    const result = openRuntimeApp("missing", appRegistry, currentState);

    // Assert
    expect(result).toEqual(currentState);
  });

  it("returns the currently open app metadata", () => {
    // Arrange
    const state = {
      kind: "open-app" as const,
      appId: "messages",
      originRect: null,
      motionMode: "full" as const,
      driver: "css" as const,
    };

    // Act
    const result = getOpenRuntimeApp(state, appRegistry);

    // Assert
    expect(result?.label).toBe("Messages");
    expect(result?.availability).toBe("coming-soon");
  });

  it("keeps the pressed icon duration brief and explicit", () => {
    // Arrange
    // No arrange needed.

    // Act
    const result = PRESSED_ICON_DURATION_MS;

    // Assert
    expect(result).toBe(120);
  });
});
