import { describe, expect, it } from "vitest";
import { createShellProfile } from "./createShellProfile";

describe("createShellProfile", () => {
  it("creates a compact profile for narrow portrait widths", () => {
    // Arrange
    const metrics = {
      width: 375,
      height: 812,
      safeArea: {
        top: 47,
        right: 0,
        bottom: 34,
        left: 0,
      },
    };

    // Act
    const result = createShellProfile(metrics);

    // Assert
    expect(result.kind).toBe("compact");
    expect(result.gridColumns).toBe(4);
    expect(result.statusBarInsetTop).toBeGreaterThan(metrics.safeArea.top);
    expect(result.dockInsetBottom).toBeGreaterThan(metrics.safeArea.bottom);
  });

  it("creates a balanced profile for mid-size portrait widths", () => {
    // Arrange
    const metrics = {
      width: 390,
      height: 844,
      safeArea: {
        top: 59,
        right: 0,
        bottom: 34,
        left: 0,
      },
    };

    // Act
    const result = createShellProfile(metrics);

    // Assert
    expect(result.kind).toBe("balanced");
    expect(result.iconSize).toBe(60);
    expect(result.iconGapY).toBe(22);
  });

  it("creates an expanded profile for larger portrait widths", () => {
    // Arrange
    const metrics = {
      width: 430,
      height: 932,
      safeArea: {
        top: 59,
        right: 0,
        bottom: 34,
        left: 0,
      },
    };

    // Act
    const result = createShellProfile(metrics);

    // Assert
    expect(result.kind).toBe("expanded");
    expect(result.iconSize).toBe(64);
    expect(result.dockHeight).toBe(94);
  });

  it("compresses spacing before shrinking icons on very tall layouts", () => {
    // Arrange
    const metrics = {
      width: 390,
      height: 920,
      safeArea: {
        top: 59,
        right: 0,
        bottom: 34,
        left: 0,
      },
    };

    // Act
    const result = createShellProfile(metrics);

    // Assert
    expect(result.kind).toBe("balanced");
    expect(result.iconSize).toBe(60);
    expect(result.iconGapX).toBe(14);
    expect(result.iconGapY).toBe(18);
  });

  it("shrinks icons only after spacing is compressed on very narrow layouts", () => {
    // Arrange
    const metrics = {
      width: 350,
      height: 812,
      safeArea: {
        top: 44,
        right: 0,
        bottom: 20,
        left: 0,
      },
    };

    // Act
    const result = createShellProfile(metrics);

    // Assert
    expect(result.kind).toBe("compact");
    expect(result.iconGapX).toBe(12);
    expect(result.iconGapY).toBe(14);
    expect(result.iconSize).toBe(52);
  });
});
