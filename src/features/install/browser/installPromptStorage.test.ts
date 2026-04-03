import { describe, expect, it } from "vitest";
import {
  clearInstallPromptDismissedAt,
  readInstallPromptDismissedAt,
  writeInstallPromptDismissedAt,
} from "./installPromptStorage";

function createStorage() {
  const data = new Map<string, string>();

  return {
    getItem(key: string) {
      return data.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      data.set(key, value);
    },
    removeItem(key: string) {
      data.delete(key);
    },
  };
}

describe("installPromptStorage", () => {
  it("reads the new openos prompt key", () => {
    // Arrange
    const storage = createStorage();
    storage.setItem("openos.installPromptDismissedAt", "42");

    // Act
    const result = readInstallPromptDismissedAt(storage);

    // Assert
    expect(result).toBe(42);
  });

  it("falls back to the legacy iception prompt key", () => {
    // Arrange
    const storage = createStorage();
    storage.setItem("iception.installPromptDismissedAt", "84");

    // Act
    const result = readInstallPromptDismissedAt(storage);

    // Assert
    expect(result).toBe(84);
  });

  it("writes only the new openos prompt key", () => {
    // Arrange
    const storage = createStorage();

    // Act
    writeInstallPromptDismissedAt(storage, 99);

    // Assert
    expect(storage.getItem("openos.installPromptDismissedAt")).toBe("99");
    expect(storage.getItem("iception.installPromptDismissedAt")).toBeNull();
  });

  it("clears both the new and legacy prompt keys", () => {
    // Arrange
    const storage = createStorage();
    storage.setItem("openos.installPromptDismissedAt", "99");
    storage.setItem("iception.installPromptDismissedAt", "77");

    // Act
    clearInstallPromptDismissedAt(storage);

    // Assert
    expect(storage.getItem("openos.installPromptDismissedAt")).toBeNull();
    expect(storage.getItem("iception.installPromptDismissedAt")).toBeNull();
  });
});
