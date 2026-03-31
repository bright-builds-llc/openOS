import { describe, expect, it } from "vitest";
import {
  completeLaunchIntro,
  createInitialLaunchState,
} from "./LaunchState";

describe("LaunchState", () => {
  it("shows the intro on first launch", () => {
    // Arrange
    const hasLaunchedBefore = false;

    // Act
    const result = createInitialLaunchState(hasLaunchedBefore);

    // Assert
    expect(result).toEqual({
      kind: "first-launch",
      shouldShowLaunchIntro: true,
    });
  });

  it("skips the intro on returning launches", () => {
    // Arrange
    const hasLaunchedBefore = true;

    // Act
    const result = createInitialLaunchState(hasLaunchedBefore);

    // Assert
    expect(result).toEqual({
      kind: "returning",
      shouldShowLaunchIntro: false,
    });
  });

  it("completes the intro without changing the launch kind", () => {
    // Arrange
    const initialState = {
      kind: "first-launch" as const,
      shouldShowLaunchIntro: true,
    };

    // Act
    const result = completeLaunchIntro(initialState);

    // Assert
    expect(result).toEqual({
      kind: "first-launch",
      shouldShowLaunchIntro: false,
    });
  });
});
