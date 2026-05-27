import { describe, expect, it } from "vitest";
import {
  createAppSessionStorageKey,
  createAppStorageKey,
} from "./appStorage";
import {
  readAppSessionSnapshot,
  resetAppSessionSnapshot,
  writeAppSessionSnapshot,
  type AppSessionPayloadParser,
  type AppSessionStorageLike,
} from "./appSessionStorage";

type TestSession = {
  selectedId: string | null;
};

type TestStorage = AppSessionStorageLike & {
  getRaw: (key: string) => string | null;
};

const namespace = "openos.apps.notes";
const defaultSession: TestSession = { selectedId: null };

function createStorage(): TestStorage {
  const items = new Map<string, string>();

  return {
    getItem: (key: string) => items.get(key) ?? null,
    getRaw: (key: string) => items.get(key) ?? null,
    removeItem: (key: string) => {
      items.delete(key);
    },
    setItem: (key: string, value: string) => {
      items.set(key, value);
    },
  };
}

function isRecord(
  maybeValue: unknown,
): maybeValue is Record<string, unknown> {
  return (
    typeof maybeValue === "object" &&
    maybeValue !== null
  );
}

const parseTestSession: AppSessionPayloadParser<TestSession> = (
  maybeSession,
) => {
  if (
    !isRecord(maybeSession) ||
    (maybeSession.selectedId !== null &&
      typeof maybeSession.selectedId !== "string")
  ) {
    return null;
  }

  return {
    selectedId: maybeSession.selectedId,
  };
};

function readTestSession(storage: AppSessionStorageLike) {
  return readAppSessionSnapshot(storage, namespace, {
    version: 1,
    defaultSession,
    parseSession: parseTestSession,
  });
}

describe("appSessionStorage", () => {
  it("returns missing status for a missing session snapshot", () => {
    // Arrange
    const storage = createStorage();

    // Act
    const result = readTestSession(storage);

    // Assert
    expect(result).toEqual({
      status: "missing",
      session: defaultSession,
    });
  });

  it("returns loaded status for a valid session snapshot", () => {
    // Arrange
    const storage = createStorage();
    storage.setItem(
      createAppSessionStorageKey(namespace),
      JSON.stringify({
        version: 1,
        session: { selectedId: "note-1" },
      }),
    );

    // Act
    const result = readTestSession(storage);

    // Assert
    expect(result).toEqual({
      status: "loaded",
      session: { selectedId: "note-1" },
    });
  });

  it("resets malformed session JSON to the default snapshot", () => {
    // Arrange
    const storage = createStorage();
    const sessionKey = createAppSessionStorageKey(namespace);
    storage.setItem(sessionKey, "{bad-json");

    // Act
    const result = readTestSession(storage);

    // Assert
    expect(result).toEqual({
      status: "reset",
      reason: "malformed-json",
      session: defaultSession,
    });
    expect(JSON.parse(storage.getRaw(sessionKey) ?? "")).toEqual({
      version: 1,
      session: defaultSession,
    });
  });

  it("resets unsupported session versions to the default snapshot", () => {
    // Arrange
    const storage = createStorage();
    const sessionKey = createAppSessionStorageKey(namespace);
    storage.setItem(
      sessionKey,
      JSON.stringify({
        version: 99,
        session: { selectedId: "note-1" },
      }),
    );

    // Act
    const result = readTestSession(storage);

    // Assert
    expect(result).toEqual({
      status: "reset",
      reason: "unsupported-version",
      session: defaultSession,
    });
    expect(JSON.parse(storage.getRaw(sessionKey) ?? "")).toEqual({
      version: 1,
      session: defaultSession,
    });
  });

  it("resets invalid session payloads to the default snapshot", () => {
    // Arrange
    const storage = createStorage();
    const sessionKey = createAppSessionStorageKey(namespace);
    storage.setItem(
      sessionKey,
      JSON.stringify({
        version: 1,
        session: { selectedId: 42 },
      }),
    );

    // Act
    const result = readTestSession(storage);

    // Assert
    expect(result).toEqual({
      status: "reset",
      reason: "invalid-payload",
      session: defaultSession,
    });
    expect(JSON.parse(storage.getRaw(sessionKey) ?? "")).toEqual({
      version: 1,
      session: defaultSession,
    });
  });

  it("returns unavailable on storage read failure", () => {
    // Arrange
    const error = new Error("blocked read");
    const storage: AppSessionStorageLike = {
      getItem: () => {
        throw error;
      },
      removeItem: () => undefined,
      setItem: () => undefined,
    };

    // Act
    const result = readTestSession(storage);

    // Assert
    expect(result.status).toBe("unavailable");
    if (result.status !== "unavailable") {
      throw new Error("Expected unavailable result");
    }
    expect(result.reason).toBe("storage-read-failed");
    expect(result.session).toBe(defaultSession);
    expect(result.error).toBe(error);
  });

  it("returns unavailable when malformed reset write fails", () => {
    // Arrange
    const error = new Error("blocked reset");
    const storage: AppSessionStorageLike = {
      getItem: () => "{bad-json",
      removeItem: () => undefined,
      setItem: () => {
        throw error;
      },
    };

    // Act
    const result = readTestSession(storage);

    // Assert
    expect(result.status).toBe("unavailable");
    if (result.status !== "unavailable") {
      throw new Error("Expected unavailable result");
    }
    expect(result.reason).toBe("storage-reset-failed");
    expect(result.session).toBe(defaultSession);
    expect(result.error).toBe(error);
  });

  it("saves a session snapshot to the exact session key", () => {
    // Arrange
    const storage = createStorage();
    const sessionKey = createAppSessionStorageKey(namespace);

    // Act
    const result = writeAppSessionSnapshot(storage, namespace, {
      version: 1,
      session: { selectedId: "note-1" },
    });

    // Assert
    expect(result).toEqual({ status: "saved" });
    expect(JSON.parse(storage.getRaw(sessionKey) ?? "")).toEqual({
      version: 1,
      session: { selectedId: "note-1" },
    });
  });

  it("returns unavailable on storage write failure", () => {
    // Arrange
    const error = new Error("blocked write");
    const storage: AppSessionStorageLike = {
      getItem: () => null,
      removeItem: () => undefined,
      setItem: () => {
        throw error;
      },
    };

    // Act
    const result = writeAppSessionSnapshot(storage, namespace, {
      version: 1,
      session: defaultSession,
    });

    // Assert
    expect(result.status).toBe("unavailable");
    if (result.status !== "unavailable") {
      throw new Error("Expected unavailable result");
    }
    expect(result.reason).toBe("storage-write-failed");
    expect(result.error).toBe(error);
  });

  it("resets only the exact session key", () => {
    // Arrange
    const storage = createStorage();
    const sessionKey = createAppSessionStorageKey(namespace);
    const durableKey = createAppStorageKey(namespace, "notes");
    storage.setItem(
      sessionKey,
      JSON.stringify({
        version: 1,
        session: { selectedId: "note-1" },
      }),
    );
    storage.setItem(durableKey, "durable notes");

    // Act
    const result = resetAppSessionSnapshot(storage, namespace);

    // Assert
    expect(result).toEqual({ status: "reset" });
    expect(storage.getRaw(sessionKey)).toBeNull();
    expect(storage.getRaw(durableKey)).toBe("durable notes");
  });
});
