import { describe, expect, it } from "vitest";
import {
  hasSeenStandaloneLaunch,
  markStandaloneLaunchSeen,
} from "./LaunchStateStorage";

function createStorage() {
  const data = new Map<string, string>();

  return {
    getItem(key: string) {
      return data.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      data.set(key, value);
    },
  };
}

describe("LaunchStateStorage", () => {
  it("reads the new openos standalone launch key", () => {
    // Arrange
    const storage = createStorage();
    storage.setItem("openos.standaloneLaunchSeen", "true");

    // Act
    const result = hasSeenStandaloneLaunch(storage);

    // Assert
    expect(result).toBe(true);
  });

  it("falls back to the legacy iception standalone launch key", () => {
    // Arrange
    const storage = createStorage();
    storage.setItem("iception.standaloneLaunchSeen", "true");

    // Act
    const result = hasSeenStandaloneLaunch(storage);

    // Assert
    expect(result).toBe(true);
  });

  it("writes only the new openos standalone launch key", () => {
    // Arrange
    const storage = createStorage();

    // Act
    markStandaloneLaunchSeen(storage);

    // Assert
    expect(storage.getItem("openos.standaloneLaunchSeen")).toBe("true");
    expect(storage.getItem("iception.standaloneLaunchSeen")).toBeNull();
  });
});
