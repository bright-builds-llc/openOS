import { describe, expect, it } from "vitest";
import {
  createAppStorageKey,
  createAppSessionStorageKey,
  createAppStorageNamespace,
} from "../../platform/appStorage";
import {
  readAppSessionSnapshot,
  resetAppSessionSnapshot,
  type AppSessionPayloadParser,
} from "../../platform/appSessionStorage";
import {
  createStoredFolder,
  createStoredNote,
  deleteStoredNote,
  getStoredNote,
  listStoredFolders,
  listStoredNotes,
  updateStoredNote,
} from "./notesStorage";
import {
  DEFAULT_NOTES_FOLDER_ID,
  DEFAULT_NOTES_FOLDER_NAME,
} from "./notesModel";

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

type NotesSession = {
  selectedFolderId: string;
  selectedNoteId: string | null;
};

function isRecord(
  maybeValue: unknown,
): maybeValue is Record<string, unknown> {
  return (
    typeof maybeValue === "object" &&
    maybeValue !== null
  );
}

const defaultNotesSession: NotesSession = {
  selectedFolderId: DEFAULT_NOTES_FOLDER_ID,
  selectedNoteId: null,
};

const parseNotesSession: AppSessionPayloadParser<NotesSession> = (
  maybeSession,
) => {
  if (
    !isRecord(maybeSession) ||
    typeof maybeSession.selectedFolderId !== "string" ||
    (maybeSession.selectedNoteId !== null &&
      typeof maybeSession.selectedNoteId !== "string")
  ) {
    return null;
  }

  return {
    selectedFolderId: maybeSession.selectedFolderId,
    selectedNoteId: maybeSession.selectedNoteId,
  };
};

describe("notesStorage", () => {
  const namespace = createAppStorageNamespace("notes");

  it("creates and reopens persisted notes", () => {
    // Arrange
    const storage = createStorage();
    const folder = createStoredFolder(
      storage,
      namespace,
      "Recipes",
      {
        createId: () => "folder-1",
        now: () => "2026-04-11T12:00:00Z",
      },
    );

    // Act
    const createdNote = createStoredNote(
      storage,
      namespace,
      {
        title: "Inbox",
        body: "First note",
        folderId: folder?.id ?? DEFAULT_NOTES_FOLDER_ID,
      },
      {
        createId: () => "note-1",
        now: () => "2026-04-11T12:01:00Z",
      },
    );
    const reopenedNote = getStoredNote(
      storage,
      namespace,
      createdNote.id,
    );
    const folders = listStoredFolders(storage, namespace);

    // Assert
    expect(createdNote.id).toBe("note-1");
    expect(reopenedNote).toEqual(createdNote);
    expect(folders.map((item) => item.id)).toEqual([
      DEFAULT_NOTES_FOLDER_ID,
      "folder-1",
    ]);
  });

  it("updates an existing note and sorts by updated timestamp", () => {
    // Arrange
    const storage = createStorage();
    const folder = createStoredFolder(
      storage,
      namespace,
      "Work",
      {
        createId: () => "folder-1",
        now: () => "2026-04-11T09:30:00Z",
      },
    );
    createStoredNote(
      storage,
      namespace,
      {
        title: "Older",
        body: "First",
        folderId: DEFAULT_NOTES_FOLDER_ID,
      },
      {
        createId: () => "note-1",
        now: () => "2026-04-11T10:00:00Z",
      },
    );
    createStoredNote(
      storage,
      namespace,
      {
        title: "Newer",
        body: "Second",
        folderId: DEFAULT_NOTES_FOLDER_ID,
      },
      {
        createId: () => "note-2",
        now: () => "2026-04-11T11:00:00Z",
      },
    );

    // Act
    const updatedNote = updateStoredNote(
      storage,
      namespace,
      "note-1",
      {
        body: "Updated",
        folderId: folder?.id ?? DEFAULT_NOTES_FOLDER_ID,
      },
      {
        now: () => "2026-04-11T12:00:00Z",
      },
    );
    const notes = listStoredNotes(storage, namespace);

    // Assert
    expect(updatedNote?.body).toBe("Updated");
    expect(updatedNote?.folderId).toBe("folder-1");
    expect(notes.map((note) => note.id)).toEqual([
      "note-1",
      "note-2",
    ]);
  });

  it("deletes a stored note", () => {
    // Arrange
    const storage = createStorage();
    createStoredNote(
      storage,
      namespace,
      {
        title: "Delete me",
        body: "Bye",
        folderId: DEFAULT_NOTES_FOLDER_ID,
      },
      {
        createId: () => "note-1",
        now: () => "2026-04-11T10:00:00Z",
      },
    );

    // Act
    const removed = deleteStoredNote(
      storage,
      namespace,
      "note-1",
    );
    const notes = listStoredNotes(storage, namespace);

    // Assert
    expect(removed).toBe(true);
    expect(notes).toEqual([]);
  });

  it("migrates legacy note payloads into the default folder", () => {
    // Arrange
    const storage = createStorage();
    storage.setItem(
      createAppStorageKey(namespace, "notes"),
      JSON.stringify([
        {
          id: "legacy-1",
          title: "Legacy",
          body: "Migrated",
          createdAt: "2026-04-07T10:00:00Z",
          updatedAt: "2026-04-07T10:00:00Z",
        },
      ]),
    );

    // Act
    const notes = listStoredNotes(storage, namespace);
    const folders = listStoredFolders(storage, namespace);

    // Assert
    expect(notes).toHaveLength(1);
    expect(notes[0]?.folderId).toBe(DEFAULT_NOTES_FOLDER_ID);
    expect(folders).toEqual([
      expect.objectContaining({
        id: DEFAULT_NOTES_FOLDER_ID,
        name: DEFAULT_NOTES_FOLDER_NAME,
      }),
    ]);
  });

  it("rejects duplicate folder names", () => {
    // Arrange
    const storage = createStorage();
    createStoredFolder(
      storage,
      namespace,
      "Ideas",
      {
        createId: () => "folder-1",
        now: () => "2026-04-11T10:00:00Z",
      },
    );

    // Act
    const duplicateFolder = createStoredFolder(
      storage,
      namespace,
      " ideas ",
      {
        createId: () => "folder-2",
        now: () => "2026-04-11T10:05:00Z",
      },
    );
    const folders = listStoredFolders(storage, namespace);

    // Assert
    expect(duplicateFolder).toBeNull();
    expect(folders.map((folder) => folder.id)).toEqual([
      DEFAULT_NOTES_FOLDER_ID,
      "folder-1",
    ]);
  });

  it("ignores invalid stored payloads", () => {
    // Arrange
    const storage = createStorage();
    storage.setItem(
      `${namespace}.notes`,
      '{"bad":true}',
    );

    // Act
    const notes = listStoredNotes(storage, namespace);

    // Assert
    expect(notes).toEqual([]);
  });

  it("resets malformed Notes session JSON without touching durable notes", () => {
    // Arrange
    const storage = createStorage();
    createStoredNote(
      storage,
      namespace,
      {
        title: "Durable",
        body: "Session reset should not touch this",
        folderId: DEFAULT_NOTES_FOLDER_ID,
      },
      {
        createId: () => "note-1",
        now: () => "2026-04-11T10:00:00Z",
      },
    );
    storage.setItem(
      createAppSessionStorageKey(namespace),
      "{bad-json",
    );

    // Act
    const result = readAppSessionSnapshot(storage, namespace, {
      version: 1,
      defaultSession: defaultNotesSession,
      parseSession: parseNotesSession,
    });
    const durableNotes = listStoredNotes(storage, namespace);

    // Assert
    expect(result.status).toBe("reset");
    if (result.status !== "reset") {
      throw new Error("Expected reset result");
    }
    expect(result.reason).toBe("malformed-json");
    expect(
      storage.getItem(createAppStorageKey(namespace, "notes")),
    ).not.toBeNull();
    expect(durableNotes.map((note) => note.id)).toEqual([
      "note-1",
    ]);
  });

  it("resets Notes session state without removing durable notes", () => {
    // Arrange
    const storage = createStorage();
    const createdNote = createStoredNote(
      storage,
      namespace,
      {
        title: "Durable",
        body: "Session reset should not touch this",
        folderId: DEFAULT_NOTES_FOLDER_ID,
      },
      {
        createId: () => "note-1",
        now: () => "2026-04-11T10:00:00Z",
      },
    );
    storage.setItem(
      createAppSessionStorageKey(namespace),
      JSON.stringify({
        version: 1,
        session: {
          selectedFolderId: DEFAULT_NOTES_FOLDER_ID,
          selectedNoteId: createdNote.id,
        },
      }),
    );

    // Act
    const result = resetAppSessionSnapshot(storage, namespace);
    const reopenedNote = getStoredNote(
      storage,
      namespace,
      createdNote.id,
    );

    // Assert
    expect(result).toEqual({ status: "reset" });
    expect(
      storage.getItem(createAppSessionStorageKey(namespace)),
    ).toBeNull();
    expect(reopenedNote).toEqual(createdNote);
  });
});
