import { describe, expect, it } from "vitest";
import {
  beginClosingNavigation,
  beginOpeningNavigation,
  captureMotionRect,
  createInitialHomeNavigationState,
  finishClosingNavigation,
  finishOpeningNavigation,
  getActiveNavigationAppId,
  getNavigationDurationMs,
  resolveMotionDriver,
  resolveMotionMode,
  syncHomeNavigationPreferences,
} from "./homeNavigationMotion";

describe("homeNavigationMotion", () => {
  it("creates a reduced-motion initial state when reduced motion is preferred", () => {
    // Arrange
    const preferences = {
      prefersReducedMotion: true,
      supportsViewTransitions: true,
    };

    // Act
    const result = createInitialHomeNavigationState(preferences);

    // Assert
    expect(result).toEqual({
      kind: "home",
      motionMode: "reduced",
      driver: "css",
    });
  });

  it("uses view-transition driver only when full motion is allowed and supported", () => {
    // Arrange
    const motionMode = resolveMotionMode(false);

    // Act
    const result = resolveMotionDriver(motionMode, true);

    // Assert
    expect(result).toBe("view-transition");
  });

  it("captures plain motion geometry from a DOM rect", () => {
    // Arrange
    const rect = {
      left: 12,
      top: 34,
      width: 56,
      height: 78,
    } as DOMRect;

    // Act
    const result = captureMotionRect(rect);

    // Assert
    expect(result).toEqual({
      left: 12,
      top: 34,
      width: 56,
      height: 78,
    });
  });

  it("moves from opening to open-app and then to closing", () => {
    // Arrange
    const preferences = {
      prefersReducedMotion: false,
      supportsViewTransitions: false,
    };

    // Act
    const openingState = beginOpeningNavigation(
      "calculator",
      { left: 0, top: 0, width: 60, height: 60 },
      preferences,
    );
    const openState = finishOpeningNavigation(openingState);
    const closingState = beginClosingNavigation(openState, preferences);

    // Assert
    expect(openingState.kind).toBe("opening");
    expect(openState.kind).toBe("open-app");
    expect(closingState.kind).toBe("closing");
    expect(getActiveNavigationAppId(closingState)).toBe("calculator");
  });

  it("returns to the home state after closing finishes", () => {
    // Arrange
    const preferences = {
      prefersReducedMotion: false,
      supportsViewTransitions: true,
    };
    const closingState = {
      kind: "closing" as const,
      appId: "calculator",
      originRect: null,
      motionMode: "full" as const,
      driver: "view-transition" as const,
    };

    // Act
    const result = finishClosingNavigation(closingState, preferences);

    // Assert
    expect(result.kind).toBe("home");
    expect(result.motionMode).toBe("full");
  });

  it("syncs motion preferences onto an active app state", () => {
    // Arrange
    const state = {
      kind: "open-app" as const,
      appId: "calculator",
      originRect: null,
      motionMode: "full" as const,
      driver: "view-transition" as const,
    };
    const preferences = {
      prefersReducedMotion: true,
      supportsViewTransitions: true,
    };

    // Act
    const result = syncHomeNavigationPreferences(state, preferences);

    // Assert
    expect(result.motionMode).toBe("reduced");
    expect(result.driver).toBe("css");
    expect(result.kind).toBe("open-app");
  });

  it("uses gentler durations for reduced-motion transitions", () => {
    // Arrange
    const state = {
      kind: "opening" as const,
      appId: "calculator",
      originRect: null,
      motionMode: "reduced" as const,
      driver: "css" as const,
    };

    // Act
    const result = getNavigationDurationMs(state);

    // Assert
    expect(result).toBe(120);
  });
});
