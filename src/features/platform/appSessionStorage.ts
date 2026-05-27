import { createAppSessionStorageKey } from "./appStorage";

export type AppSessionStorageLike = Pick<
  Storage,
  "getItem" | "removeItem" | "setItem"
>;

export type AppSessionResetReason =
  | "malformed-json"
  | "unsupported-version"
  | "invalid-payload";

export type AppSessionReadResult<TSession> =
  | { status: "missing"; session: TSession }
  | { status: "loaded"; session: TSession }
  | {
      status: "reset";
      session: TSession;
      reason: AppSessionResetReason;
    }
  | {
      status: "unavailable";
      session: TSession;
      reason:
        | "storage-read-failed"
        | "storage-reset-failed";
      error: unknown;
    };

export type AppSessionWriteResult =
  | { status: "saved" }
  | {
      status: "unavailable";
      reason: "storage-write-failed";
      error: unknown;
    };

export type AppSessionResetResult =
  | { status: "reset" }
  | {
      status: "unavailable";
      reason: "storage-reset-failed";
      error: unknown;
    };

export type AppSessionPayloadParser<TSession> = (
  maybeSession: unknown,
) => TSession | null;

type AppSessionSnapshot<TSession> = {
  version: number;
  session: TSession;
};

type AppSessionReadOptions<TSession> = {
  version: number;
  defaultSession: TSession;
  parseSession: AppSessionPayloadParser<TSession>;
};

type ParsedAppSessionSnapshot<TSession> =
  | { status: "loaded"; session: TSession }
  | {
      status: "reset";
      session: TSession;
      reason: AppSessionResetReason;
    };

function isRecord(
  maybeValue: unknown,
): maybeValue is Record<string, unknown> {
  return (
    typeof maybeValue === "object" &&
    maybeValue !== null
  );
}

function createAppSessionSnapshot<TSession>(
  version: number,
  session: TSession,
): AppSessionSnapshot<TSession> {
  return { version, session };
}

function hasExactSessionEnvelope(
  maybeValue: Record<string, unknown>,
): boolean {
  const keys = Object.keys(maybeValue);

  return (
    keys.length === 2 &&
    keys.includes("version") &&
    keys.includes("session")
  );
}

function parseAppSessionSnapshot<TSession>(
  maybeValue: unknown,
  options: AppSessionReadOptions<TSession>,
): ParsedAppSessionSnapshot<TSession> {
  if (
    !isRecord(maybeValue) ||
    !hasExactSessionEnvelope(maybeValue) ||
    typeof maybeValue.version !== "number"
  ) {
    return {
      status: "reset",
      session: options.defaultSession,
      reason: "invalid-payload",
    };
  }

  if (maybeValue.version !== options.version) {
    return {
      status: "reset",
      session: options.defaultSession,
      reason: "unsupported-version",
    };
  }

  const maybeSession = options.parseSession(
    maybeValue.session,
  );

  if (maybeSession === null) {
    return {
      status: "reset",
      session: options.defaultSession,
      reason: "invalid-payload",
    };
  }

  return { status: "loaded", session: maybeSession };
}

function resetInvalidAppSessionSnapshot<TSession>(
  storage: AppSessionStorageLike,
  storageKey: string,
  options: AppSessionReadOptions<TSession>,
  reason: AppSessionResetReason,
): AppSessionReadResult<TSession> {
  try {
    storage.setItem(
      storageKey,
      JSON.stringify(
        createAppSessionSnapshot(
          options.version,
          options.defaultSession,
        ),
      ),
    );
  } catch (error) {
    return {
      status: "unavailable",
      session: options.defaultSession,
      reason: "storage-reset-failed",
      error,
    };
  }

  return {
    status: "reset",
    session: options.defaultSession,
    reason,
  };
}

export function readAppSessionSnapshot<TSession>(
  storage: AppSessionStorageLike,
  namespace: string,
  options: AppSessionReadOptions<TSession>,
): AppSessionReadResult<TSession> {
  const storageKey = createAppSessionStorageKey(namespace);
  let maybeStoredValue: string | null;

  try {
    maybeStoredValue = storage.getItem(storageKey);
  } catch (error) {
    return {
      status: "unavailable",
      session: options.defaultSession,
      reason: "storage-read-failed",
      error,
    };
  }

  if (maybeStoredValue === null) {
    return {
      status: "missing",
      session: options.defaultSession,
    };
  }

  let maybeParsed: unknown;

  try {
    maybeParsed = JSON.parse(maybeStoredValue);
  } catch {
    return resetInvalidAppSessionSnapshot(
      storage,
      storageKey,
      options,
      "malformed-json",
    );
  }

  const parsedSnapshot = parseAppSessionSnapshot(
    maybeParsed,
    options,
  );

  if (parsedSnapshot.status === "loaded") {
    return parsedSnapshot;
  }

  return resetInvalidAppSessionSnapshot(
    storage,
    storageKey,
    options,
    parsedSnapshot.reason,
  );
}

export function writeAppSessionSnapshot<TSession>(
  storage: AppSessionStorageLike,
  namespace: string,
  snapshot: AppSessionSnapshot<TSession>,
): AppSessionWriteResult {
  try {
    storage.setItem(
      createAppSessionStorageKey(namespace),
      JSON.stringify(
        createAppSessionSnapshot(
          snapshot.version,
          snapshot.session,
        ),
      ),
    );
  } catch (error) {
    return {
      status: "unavailable",
      reason: "storage-write-failed",
      error,
    };
  }

  return { status: "saved" };
}

export function resetAppSessionSnapshot(
  storage: AppSessionStorageLike,
  namespace: string,
): AppSessionResetResult {
  try {
    storage.removeItem(createAppSessionStorageKey(namespace));
  } catch (error) {
    return {
      status: "unavailable",
      reason: "storage-reset-failed",
      error,
    };
  }

  return { status: "reset" };
}
