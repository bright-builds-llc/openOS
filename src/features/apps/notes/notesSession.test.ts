import { describe, expect, it } from "vitest";
import {
  createAppStorageKey,
  createAppSessionStorageKey,
} from "../../platform/appStorage";
import {
  NOTE_CONTENT_DOCUMENT_VERSION,
  type NoteContentDocument,
} from "./notesContent";
import {
  DEFAULT_NOTES_FOLDER_ID,
  type Note,
  type NoteFolder,
} from "./notesModel";
import {
  NOTES_ALL_FOLDER_ID,
  NOTES_SESSION_VERSION,
  createDefaultNotesSession,
  parseNotesSession,
  readNotesSession,
  resolveNotesSession,
  writeNotesSession,
  type NotesSession,
} from "./notesSession";

function createStorage(): Storage {
  const items = new Map<string, string>();

  return {
    clear: () => {
      items.clear();
    },
    getItem: (key: string) => items.get(key) ?? null,
    key: (index: number) =>
      Array.from(items.keys())[index] ?? null,
    get length() {
      return items.size;
    },
    removeItem: (key: string) => {
      items.delete(key);
    },
    setItem: (key: string, value: string) => {
      items.set(key, value);
    },
  } as Storage;
}

function createTrackedStorage(): Storage & {
  getKeys: string[];
  setKeys: string[];
} {
  const storage = createStorage();
  const getKeys: string[] = [];
  const setKeys: string[] = [];

  return {
    ...storage,
    getKeys,
    setKeys,
    getItem: (key: string) => {
      getKeys.push(key);
      return storage.getItem(key);
    },
    setItem: (key: string, value: string) => {
      setKeys.push(key);
      storage.setItem(key, value);
    },
  };
}

function createFailingReadStorage(): Storage {
  return {
    ...createStorage(),
    getItem: () => {
      throw new Error("storage read failed");
    },
  } as Storage;
}

function createFailingWriteStorage(): Storage {
  return {
    ...createStorage(),
    setItem: () => {
      throw new Error("storage write failed");
    },
  } as Storage;
}

function createContent(blocks: NoteContentDocument["blocks"]): NoteContentDocument {
  return {
    version: NOTE_CONTENT_DOCUMENT_VERSION,
    blocks,
  };
}

function createFolder(id: string): NoteFolder {
  return {
    id,
    name: id,
    createdAt: "2026-04-11T10:00:00Z",
    updatedAt: "2026-04-11T10:00:00Z",
  };
}

function createNote(input: {
  id: string;
  title: string;
  folderId: string;
  content: NoteContentDocument;
}): Note {
  return {
    id: input.id,
    title: input.title,
    content: input.content,
    folderId: input.folderId,
    createdAt: "2026-04-11T10:00:00Z",
    updatedAt: "2026-04-11T10:00:00Z",
  };
}

describe("notesSession", () => {
  const namespace = "openos.apps.notes";
  const sessionKey = createAppSessionStorageKey(namespace);
  const durableNotesKey = createAppStorageKey(namespace, "notes");

  it("creates default all-folder session context", () => {
    // Act
    const result = createDefaultNotesSession();

    // Assert
    expect(result).toEqual({
      selectedFolderId: NOTES_ALL_FOLDER_ID,
      selectedNoteId: null,
      searchQuery: "",
      selectedBlockIndex: null,
    });
  });

  it("reads missing sessions from the exact session key", () => {
    // Arrange
    const storage = createTrackedStorage();
    storage.setItem(durableNotesKey, "durable-notes");
    storage.getKeys.length = 0;

    // Act
    const result = readNotesSession(storage, namespace);

    // Assert
    expect(result).toEqual({
      status: "missing",
      session: createDefaultNotesSession(),
    });
    expect(storage.getKeys).toEqual([sessionKey]);
  });

  it("loads versioned sessions from the exact session key", () => {
    // Arrange
    const storage = createTrackedStorage();
    const session: NotesSession = {
      selectedFolderId: "folder-work",
      selectedNoteId: "note-1",
      searchQuery: "trip",
      selectedBlockIndex: 1,
    };
    storage.setItem(
      sessionKey,
      JSON.stringify({
        version: NOTES_SESSION_VERSION,
        session,
      }),
    );
    storage.setItem(durableNotesKey, "durable-notes");
    storage.getKeys.length = 0;

    // Act
    const result = readNotesSession(storage, namespace);

    // Assert
    expect(result).toEqual({ status: "loaded", session });
    expect(storage.getKeys).toEqual([sessionKey]);
  });

  it("resets malformed sessions through the shared session helper", () => {
    // Arrange
    const storage = createStorage();
    storage.setItem(sessionKey, "{bad-json");
    storage.setItem(durableNotesKey, "durable-notes");

    // Act
    const result = readNotesSession(storage, namespace);

    // Assert
    expect(result.status).toBe("reset");
    if (result.status !== "reset") {
      throw new Error("Expected reset status");
    }
    expect(result.reason).toBe("malformed-json");
    expect(storage.getItem(durableNotesKey)).toBe("durable-notes");
  });

  it("returns unavailable when session storage cannot be read", () => {
    // Arrange
    const storage = createFailingReadStorage();

    // Act
    const result = readNotesSession(storage, namespace);

    // Assert
    expect(result.status).toBe("unavailable");
    if (result.status !== "unavailable") {
      throw new Error("Expected unavailable status");
    }
    expect(result.reason).toBe("storage-read-failed");
    expect(result.session).toEqual(createDefaultNotesSession());
  });

  it.each([
    ["selectedFolderId", { selectedFolderId: 1 }],
    ["selectedNoteId", { selectedNoteId: 1 }],
    ["searchQuery", { searchQuery: null }],
    ["selectedBlockIndex", { selectedBlockIndex: 1.5 }],
    ["selectedBlockIndex", { selectedBlockIndex: -1 }],
  ])("rejects invalid %s payloads", (_field, partialSession) => {
    // Arrange
    const maybeSession = {
      ...createDefaultNotesSession(),
      ...partialSession,
    };

    // Act
    const result = parseNotesSession(maybeSession);

    // Assert
    expect(result).toBeNull();
  });

  it("writes only disposable Notes session fields", () => {
    // Arrange
    const storage = createTrackedStorage();
    const session: NotesSession = {
      selectedFolderId: "folder-work",
      selectedNoteId: "note-1",
      searchQuery: "trip",
      selectedBlockIndex: 2,
    };

    // Act
    const result = writeNotesSession(storage, namespace, session);

    // Assert
    expect(result).toEqual({ status: "saved" });
    expect(storage.setKeys).toEqual([sessionKey]);
    expect(JSON.parse(storage.getItem(sessionKey) ?? "{}")).toEqual({
      version: NOTES_SESSION_VERSION,
      session,
    });
  });

  it("returns unavailable when session storage cannot be written", () => {
    // Arrange
    const storage = createFailingWriteStorage();

    // Act
    const result = writeNotesSession(
      storage,
      namespace,
      createDefaultNotesSession(),
    );

    // Assert
    expect(result.status).toBe("unavailable");
    if (result.status !== "unavailable") {
      throw new Error("Expected unavailable status");
    }
    expect(result.reason).toBe("storage-write-failed");
  });

  it("keeps valid folder, note, search text, and block index", () => {
    // Arrange
    const folders = [
      createFolder(DEFAULT_NOTES_FOLDER_ID),
      createFolder("folder-work"),
    ];
    const notes = [
      createNote({
        id: "note-1",
        title: "Trip plan",
        folderId: "folder-work",
        content: createContent([
          { kind: "heading", text: "Trip plan" },
          { kind: "paragraph", text: "Book train" },
        ]),
      }),
    ];
    const session: NotesSession = {
      selectedFolderId: "folder-work",
      selectedNoteId: "note-1",
      searchQuery: "trip",
      selectedBlockIndex: 1,
    };

    // Act
    const result = resolveNotesSession(session, {
      folders,
      notes,
    });

    // Assert
    expect(result).toEqual(session);
  });

  it("falls back stale folder, note, and block index to nearest visible context", () => {
    // Arrange
    const folders = [createFolder(DEFAULT_NOTES_FOLDER_ID)];
    const notes = [
      createNote({
        id: "note-visible",
        title: "Visible",
        folderId: DEFAULT_NOTES_FOLDER_ID,
        content: createContent([
          { kind: "heading", text: "Visible" },
          { kind: "paragraph", text: "Body" },
        ]),
      }),
    ];
    const session: NotesSession = {
      selectedFolderId: "missing-folder",
      selectedNoteId: "missing-note",
      searchQuery: "",
      selectedBlockIndex: 8,
    };

    // Act
    const result = resolveNotesSession(session, {
      folders,
      notes,
    });

    // Assert
    expect(result).toEqual({
      selectedFolderId: NOTES_ALL_FOLDER_ID,
      selectedNoteId: "note-visible",
      searchQuery: "",
      selectedBlockIndex: 1,
    });
  });

  it("uses all-folder filtering and clears selection when no notes are visible", () => {
    // Arrange
    const session: NotesSession = {
      selectedFolderId: NOTES_ALL_FOLDER_ID,
      selectedNoteId: "missing-note",
      searchQuery: "nomatch",
      selectedBlockIndex: 0,
    };

    // Act
    const result = resolveNotesSession(session, {
      folders: [createFolder(DEFAULT_NOTES_FOLDER_ID)],
      notes: [
        createNote({
          id: "note-hidden",
          title: "Hidden",
          folderId: DEFAULT_NOTES_FOLDER_ID,
          content: createContent([
            { kind: "paragraph", text: "Different" },
          ]),
        }),
      ],
    });

    // Assert
    expect(result).toEqual({
      selectedFolderId: NOTES_ALL_FOLDER_ID,
      selectedNoteId: null,
      searchQuery: "nomatch",
      selectedBlockIndex: null,
    });
  });
});
